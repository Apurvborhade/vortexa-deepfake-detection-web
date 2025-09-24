import sys, json
from pathlib import Path
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification, pipeline
import cv2
from timm import create_model
import numpy as np
import os
import yaml


# Video Model
# Import GenConViT from the official repo
# Add the root folder of GenConViT to Python path
repo_root = Path(__file__).parent / "GenConViT"
sys.path.append(str(repo_root))
from model.genconvit import GenConViT

file_path = sys.argv[1]
ext = Path(file_path).suffix.lower()

# --- Image Model ---
IMAGE_MODEL = "prithivMLmods/Deep-Fake-Detector-v2-Model"
image_processor = AutoImageProcessor.from_pretrained(IMAGE_MODEL)
image_model = AutoModelForImageClassification.from_pretrained(IMAGE_MODEL)


# Video Model
VIDEO_PATH = "example_video.mp4"         # your input video
MAX_FRAMES = 16                          # number of frames to sample
MODEL_WEIGHTS = "weights/genconvit_ed_inference.pth"
VAE_WEIGHTS = "weights/genconvit_vae_inference.pth"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
image_model.to(DEVICE)
image_model.eval()
# -----------------------------
# FRAME EXTRACTION
# -----------------------------
def extract_frames(video_path, max_frames=16):
    frames = []
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, total_frames // max_frames)

    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if count % step == 0:
            # Convert BGR to RGB and normalize to [0,1]
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = frame.astype(np.float32) / 255.0
            frames.append(frame)
        count += 1
    cap.release()
    return frames

# -----------------------------
# LOAD GENCONViT MODEL
# -----------------------------
def load_genconvit_model(ed_path, vae_path, device):
    config = {}
    config_path = os.path.join('config.yaml')  # adjust path
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    ed_weights = "genconvit_ed"   # filename without .pth
    vae_weights = "genconvit_vae" # filename without .pth
    net_type = "ed"               # 'ed', 'vae', or other
    use_fp16 = False
    model = GenConViT(config, ed_weights, vae_weights,net_type, use_fp16)  # official model class

    model.to(device)
    model.eval()

    # Load VAE if needed (optional)
    vae = torch.load(vae_path, map_location=device) if Path(vae_path).exists() else None
    return model, vae

# -----------------------------
# PREPROCESS FRAMES FOR MODEL
# -----------------------------
def preprocess_frames(frames, device):
    # Resize frames to 224x224 (standard for GenConViT)
    processed = [cv2.resize(f, (224, 224)) for f in frames]
    # Convert to tensor: [B, C, H, W]
    tensor = torch.tensor(np.array(processed)).permute(0, 3, 1, 2)  # [B, H, W, C] -> [B, C, H, W]
    tensor = tensor.to(device)
    return tensor

# -----------------------------
# INFERENCE
# -----------------------------
def predict_video(model, frames_tensor):
    with torch.no_grad():
        outputs = model(frames_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
    return probs.cpu().numpy()


def classify_image(image_path):
    # Load image
    img = Image.open(image_path).convert("RGB")
    
    # Preprocess
    inputs = image_processor(images=img, return_tensors="pt")
    
    # Forward pass
    with torch.no_grad():
        outputs = image_model(**inputs)
    
    # Softmax to get probabilities
    probs = torch.nn.functional.softmax(outputs.logits, dim=1).squeeze().tolist()
    
    # Map labels
    labels = image_model.config.id2label
    results = {labels[i]: round(probs[i], 3) for i in range(len(probs))}
    return results

if __name__ == "__main__":
    import sys
    
    # file_path = sys.argv[1]  # Pass image path as argument
    # result = classify_image(file_path)
    # print(json.dumps(result, indent=2))
    
    video_path = sys.argv[1]
    frames = extract_frames(video_path, MAX_FRAMES)
    print(f"Extracted {len(frames)} frames from video.")
    
    model, vae = load_genconvit_model(MODEL_WEIGHTS, VAE_WEIGHTS, DEVICE)
    print("GenConViT model loaded.")
    
     # Preprocess frames
    frames_tensor = preprocess_frames(frames, DEVICE)

    # Predict
    probs = predict_video(model, frames_tensor)
    print("Prediction probabilities per frame:")
 

    # Average across frames for video-level prediction
    video_pred = probs.mean(axis=0)
    labels = ["Real", "Deepfake"]
    result = {labels[i]: float(video_pred[i]) for i in range(len(labels))}
    print("\nVideo-level prediction:")
    print(result)
