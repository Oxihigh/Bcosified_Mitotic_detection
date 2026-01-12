Based on the detailed project report and paper you uploaded, here is a professional, ready-to-use `README.md` file for your GitHub repository.

You can create a file named `README.md` in your project root and paste this content directly.

---

```markdown
# An Explainable AI Decision Support System for Mitotic Detection using B-cos Networks

![Project Banner](https://img.shields.io/badge/Status-Completed-success) ![Python](https://img.shields.io/badge/Python-3.7%2B-blue) ![PyTorch](https://img.shields.io/badge/PyTorch-2.0-orange) ![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

## 📄 Abstract
Mitotic count is a critical prognostic factor in breast cancer grading (Nottingham Grading System). However, manual counting is labor-intensive, subjective, and prone to inter-observer variability.

This project introduces a **Transparent Decision Support System** that automates mitotic figure detection while prioritizing clinical trust. Unlike standard "Black Box" AI, our system uses **B-cos Networks** to provide "faithful-by-design" pixel-level explanations for every prediction.

## 🚀 Key Features
* [cite_start]**Scalable Detection (Stage 1):** Utilizes **YOLOv11L** integrated with **SAHI (Slicing Aided Hyper Inference)** to detect small mitotic figures in high-resolution Whole Slide Images (WSIs) without downsampling artifacts[cite: 631].
* [cite_start]**Interpretable Classification (Stage 2):** A **B-cos ResNet50** classifier that distinguishes mitotic cells from mimics (e.g., apoptotic bodies) with **94% Precision**[cite: 733].
* [cite_start]**Faithful Explainability:** Generates high-fidelity saliency maps directly from the model's forward pass, avoiding the inaccuracies of post-hoc methods like Grad-CAM[cite: 633].
* [cite_start]**Smart Focus Visualization:** A novel clinical visualization tool that uses saliency maps as alpha masks to blur background noise and spotlight diagnostic chromatin features[cite: 634].

## 🛠️ Tech Stack
* **Deep Learning:** PyTorch, Ultralytics YOLOv11
* **Data Processing:** NumPy, Pillow, SAHI
* **Backend:** FastAPI (Python)
* **Frontend:** Next.js (React)
* **Visualization:** Matplotlib
* [cite_start]**Hardware:** Optimized for NVIDIA T4 GPU [cite: 704]

## 📊 Pipeline Overview
1.  **Input:** High-resolution Histopathology ROI (TUPAC16 Dataset).
2.  **Preprocessing:** Normalization & stain-preserving augmentation.
3.  **Candidate Identification:** SAHI slices the image → YOLOv11 detects candidates → Global Stitching & NMS.
4.  **Candidate Recognition:** B-cos ResNet50 classifies crops & generates explanation maps.
5.  **Output:** Final annotated image + "Smart Focus" interactive overlay.

## 📉 Performance Metrics
[cite_start]Our system achieves a competitive balance of sensitivity and specificity[cite: 745]:

| Stage | Model | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | YOLOv11L + SAHI | 0.82 | 0.74 | 0.78 |
| **Stage 2** | B-cos ResNet50 | **0.94** | 0.83 | 0.88 |
| **Pipeline** | **End-to-End** | **0.94*** | **0.62*** | **0.75** |

> *Projected pipeline performance based on component interaction.*

## 💻 Installation & Setup

### Prerequisites
* Python 3.8+
* Node.js & npm
* Git LFS (Large File Storage)

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/mitotic-detection-system.git](https://github.com/YOUR_USERNAME/mitotic-detection-system.git)
cd mitotic-detection-system
git lfs pull  # Download model weights

```

### 2. Backend Setup (Python)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

```

### 3. Frontend Setup (Next.js)

```bash
cd ../app
npm install

```

## ▶️ Usage

1. **Start the Backend API:**
```bash
cd backend
python main.py

```


2. **Start the Frontend UI:**
```bash
cd app
npm run dev

```


3. **Access the Dashboard:**
Open `http://localhost:3000` in your browser. Upload a sample ROI image to see the detection and Smart Focus visualization in action.

## 👥 Team

**Department of Information Science and Engineering** **Jyothy Institute of Technology, Bengaluru** 

* **Rajesh Kumar K** (1JT22IS036)
* **Sai Skanda A** (1JT22IS042)
* **Skanda S** (1JT22IS048)
* **Dhruthi Halibandi** (1JT22IS014)

**Guide:** Asst. Prof. Rashmi K S 

## 📜 License

This project is developed for academic research purposes.

```

```
