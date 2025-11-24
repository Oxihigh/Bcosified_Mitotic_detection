import torch
import torch.nn as nn
import math
import logging
from pathlib import Path
import sys

# Add backend to path
backend_dir = Path(__file__).parent.parent.resolve()
if str(backend_dir) not in sys.path:
    sys.path.append(str(backend_dir))

# --- Import B-cos Only ---
try:
    from bcos.models import resnet
    from bcos.modules import BcosConv2d, LogitLayer
    from bcos.data.presets import ImageNetClassificationPresetEval
    from interpretability.explanation_methods.explainers.ours import Ours as BcosSaliency
except ImportError as e:
    logging.error(f"Import Error: {e}")
    raise

from sahi import AutoDetectionModel

WEIGHTS_DIR = Path(__file__).parent / "weights"
YOLO_MODEL_PATH = str(WEIGHTS_DIR / "best1.pt")
RESNET_MODEL_PATH = str(WEIGHTS_DIR / "best_mitotic_sunday_model_v1.pth")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def get_continued_finetune_model_with_dropout(base_model_name, weights_path, num_classes=2, dropout_prob=0.5):
    model = getattr(resnet, base_model_name)()
    in_features = model.num_features
    new_classifier = BcosConv2d(in_features, num_classes, kernel_size=1)
    model.fc = nn.Sequential(nn.Dropout2d(p=dropout_prob), new_classifier)
    model.logit_layer = LogitLayer(logit_bias=-math.log(num_classes - 1))
    model.num_classes = num_classes
    state_dict = torch.load(weights_path, map_location=torch.device("cpu"))
    model.load_state_dict(state_dict, strict=True)
    return model

class ModelManager:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        self.yolo_model = None
        self.resnet_model = None
        self.resnet_transform = None
        self.bcos_explainer = None
        self.mitotic_class_id = 0 
        self.device = DEVICE
        self.load_models()

    def load_models(self):
        try:
            # 1. YOLO
            self.logger.info("Loading YOLO...")
            self.yolo_model = AutoDetectionModel.from_pretrained(
                model_type='yolov8', model_path=YOLO_MODEL_PATH,
                confidence_threshold=0.5, device=self.device
            )

            # 2. ResNet
            self.logger.info("Loading ResNet...")
            self.resnet_model = get_continued_finetune_model_with_dropout(
                base_model_name="resnet50", weights_path=RESNET_MODEL_PATH,
                num_classes=2, dropout_prob=0.5
            )
            self.resnet_model.to(self.device)
            self.resnet_model.eval()

            # 3. Transform
            self.resnet_transform = ImageNetClassificationPresetEval(
                crop_size=256, is_bcos=True,
            )

            # 4. Explainer (B-cos Only)
            self.logger.info("Initializing B-cos Explainer...")
            self.bcos_explainer = BcosSaliency(self.resnet_model)
            
            self.logger.info("Models loaded.")

        except Exception as e:
            self.logger.error(f"Error loading models: {e}", exc_info=True)
            raise

model_manager = ModelManager()