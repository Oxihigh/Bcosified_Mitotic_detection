import uvicorn
import cv2
import numpy as np
import logging
import base64
import io
import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from PIL import Image
import torch

# --- Model & Helper Imports ---
try:
    from models.model_loader import model_manager
except ImportError:
    logging.critical("Could not import model_manager. Make sure models/model_loader.py exists.")
    raise

from sahi.predict import get_sliced_prediction

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Helper Functions ---

def encode_image_to_base64(img_array):
    """Encodes a NumPy array (BGR) image to a base64 PNG string."""
    _, buffer = cv2.imencode(".png", img_array)
    return base64.b64encode(buffer).decode("utf-8")

def pad_to_square(pil_img, size=256, fill_color=(128, 128, 128)):
    w, h = pil_img.size
    if w == size and h == size:
        return pil_img
    new_img = Image.new('RGB', (size, size), fill_color)
    new_img.paste(pil_img, ((size - w) // 2, (size - h) // 2))
    return new_img

def generate_saliency_map(explainer, input_tensor, target_class_id):
    """
    Generates B-cos saliency map.
    """
    input_tensor.requires_grad = True
    
    # B-cos uses 'tgts' (targets argument name varies by library version, 'tgts' is safer for B-cos base)
    attribution_map = explainer.attribute_selection(
        input_tensor, targets=[target_class_id]
    )

    attribution_map_3ch = attribution_map[:, :3, :, :]
    attribution_map = attribution_map_3ch.sum(dim=1, keepdim=True)
    heatmap = torch.nn.functional.interpolate(
        attribution_map, size=(256, 256), mode="bilinear", align_corners=False
    )
    heatmap = heatmap.abs().squeeze().cpu().detach().numpy()
    
    # Normalize to 0-1 range
    heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)
    return heatmap

def apply_smart_focus(original_bgr, saliency_map):
    h, w = original_bgr.shape[:2]
    saliency_resized = cv2.resize(saliency_map.squeeze(), (w, h))
    
    mask = saliency_resized
    mask = (mask - mask.min()) / (mask.max() - mask.min() + 1e-8) 
    mask = np.power(mask, 0.5) 
    mask = np.stack([mask, mask, mask], axis=2) 

    blurred_img = cv2.GaussianBlur(original_bgr, (51, 51), 0)

    focused_image = (original_bgr * mask + blurred_img * (1 - mask)).astype(np.uint8)
    return focused_image

# --- FastAPI App ---
app = FastAPI(title="Explainable AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    logger.info("FastAPI server starting...")
    logger.info("ModelManager should be loaded.")

@app.get("/")
def home():
    return {"status": "ok", "message": "B-cos Pipeline API is running."}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        # --- 1. Read and Prepare Image ---
        logger.info(f"Received image: {image.filename}")
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        original_image_bgr = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        img_h, img_w = original_image_bgr.shape[:2]
        
        yolo_annotated_image = original_image_bgr.copy()
        
        # Global Blur Setup
        blurred_base = cv2.GaussianBlur(original_image_bgr, (51, 51), 0)
        global_saliency_mask = np.zeros((img_h, img_w), dtype=np.float32)
        confirmed_boxes = []

        # --- 2. Stage 1: YOLO ---
        logger.info("Running Stage 1: YOLO Sliced Prediction...")
        sahi_result = get_sliced_prediction(
            pil_image,
            model_manager.yolo_model,
            slice_height=512, slice_width=512,
            overlap_height_ratio=0.2, overlap_width_ratio=0.2
        )
        detections = sahi_result.object_prediction_list
        
        if not detections:
            return {"message": "No candidates found."}

        # --- 3. Stage 2: Classification & Explainability ---
        classifications = []
        patch_size = 256
        half_size = patch_size // 2

        for i, det in enumerate(detections):
            bbox = det.bbox.to_xyxy()
            x1, y1, x2, y2 = int(bbox[0]), int(bbox[1]), int(bbox[2]), int(bbox[3])
            cv2.rectangle(yolo_annotated_image, (x1, y1), (x2, y2), (255, 0, 0), 2)
            
            center_x, center_y = (x1 + x2) // 2, (y1 + y2) // 2
            new_x1, new_y1 = center_x - half_size, center_y - half_size
            new_x2, new_y2 = center_x + half_size, center_y + half_size
            new_x1_c, new_y1_c = max(0, new_x1), max(0, new_y1)
            new_x2_c, new_y2_c = min(img_w, new_x2), min(img_h, new_y2)

            patch_pil = pil_image.crop((new_x1_c, new_y1_c, new_x2_c, new_y2_c))
            padded_patch_pil = pad_to_square(patch_pil, size=patch_size)
            
            input_tensor = model_manager.resnet_transform(padded_patch_pil).unsqueeze(0).to(model_manager.device)
            
            with torch.no_grad():
                output = model_manager.resnet_model(input_tensor)
                probabilities = torch.softmax(output, dim=1)
                confidence = probabilities[0, model_manager.mitotic_class_id].item()
                predicted_class = torch.argmax(probabilities, dim=1).item()
            
            class_name = "mitotic" if predicted_class == model_manager.mitotic_class_id else "not_mitotic"
            heatmap_b64 = None

            if predicted_class == model_manager.mitotic_class_id and confidence >= 0.7:
                # --- Use B-cos Explainer ---
                saliency_map = generate_saliency_map(
                    explainer=model_manager.bcos_explainer,
                    input_tensor=input_tensor,
                    target_class_id=model_manager.mitotic_class_id
                )
                
                # Global Mask Update
                patch_h = new_y2_c - new_y1_c
                patch_w = new_x2_c - new_x1_c
                saliency_resized = cv2.resize(saliency_map.squeeze(), (patch_w, patch_h))
                
                current_mask_region = global_saliency_mask[new_y1_c:new_y2_c, new_x1_c:new_x2_c]
                global_saliency_mask[new_y1_c:new_y2_c, new_x1_c:new_x2_c] = np.maximum(
                    current_mask_region, saliency_resized
                )

                confirmed_boxes.append(((new_x1, new_y1), (new_x2, new_y2), confidence))

                patch_bgr = original_image_bgr[new_y1_c:new_y2_c, new_x1_c:new_x2_c]
                focused_patch = apply_smart_focus(patch_bgr, saliency_map)
                heatmap_b64 = encode_image_to_base64(focused_patch)
            
            classifications.append({
                "id": i, "class": class_name, "confidence": float(confidence),
                "bbox": [x1, y1, x2, y2], "heatmap_image": heatmap_b64 
            })

        # --- 4. Create Final Composite ---
        global_mask_3d = np.power(global_saliency_mask, 0.5)
        global_mask_3d = np.stack([global_mask_3d]*3, axis=2)
        
        final_annotated_image = (original_image_bgr * global_mask_3d + blurred_base * (1 - global_mask_3d)).astype(np.uint8)

        for (pt1, pt2, conf) in confirmed_boxes:
            cv2.rectangle(final_annotated_image, pt1, pt2, (0, 255, 0), 2)
            cv2.putText(final_annotated_image, f"M: {conf:.2f}", (pt1[0], pt1[1] - 10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        mitotic_count = sum(1 for c in classifications if c["class"] == "mitotic" and c["confidence"] >= 0.7)
        logger.info(f"Prediction complete. Found {mitotic_count} confirmed mitotic cells.")

        return {
            "original_image": encode_image_to_base64(original_image_bgr),
            "yolo_annotated_image": encode_image_to_base64(yolo_annotated_image),
            "final_annotated_image": encode_image_to_base64(final_annotated_image),
            "detections": classifications,
            "summary": {
                "total_candidates": len(detections),
                "mitotic_count": mitotic_count,
                "non_mitotic_count": len(classifications) - mitotic_count
            }
        }

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)