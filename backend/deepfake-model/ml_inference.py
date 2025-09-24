import sys
import json
from pathlib import Path
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
import cv2
import numpy as np
import os
import yaml

# Add GenConViT repo to path and import
repo_root = Path(__file__).parent / "GenConViT"
sys.path.append(str(repo_root))
from model.genconvit import GenConViT

# --- Image Model ---
IMAGE_MODEL = "prithivMLmods/Deep-Fake-Detector-v2-Model"
image_processor = AutoImageProcessor.from_pretrained(IMAGE_MODEL)
image_model = AutoModelForImageClassification.from_pretrained(IMAGE_MODEL)
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
image_model.to(DEVICE)
image_model.eval()

# --- Video Model ---
MAX_FRAMES = 16
MODEL_WEIGHTS = "weights/genconvit_ed_inference.pth"
VAE_WEIGHTS = "weights/genconvit_vae_inference.pth"

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
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame = frame.astype(np.float32) / 255.0
            frames.append(frame)
        count += 1
    cap.release()
    return frames

def load_genconvit_model(ed_path, vae_path, device):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    config_path = os.path.join(script_dir, "config.yaml")
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    ed_weights = "genconvit_ed"
    vae_weights = "genconvit_vae"
    net_type = "ed"
    use_fp16 = False
    model = GenConViT(config, ed_weights, vae_weights, net_type, use_fp16)
    model.to(device)
    model.eval()
    vae = torch.load(vae_path, map_location=device) if Path(vae_path).exists() else None
    return model, vae

def preprocess_frames(frames, device):
    processed = [cv2.resize(f, (224, 224)) for f in frames]
    tensor = torch.tensor(np.array(processed)).permute(0, 3, 1, 2)
    tensor = tensor.to(device)
    return tensor

def predict_video(model, frames_tensor):
    with torch.no_grad():
        outputs = model(frames_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
    return probs.cpu().numpy()

def classify_image(image_path):
    img = Image.open(image_path).convert("RGB")
    inputs = image_processor(images=img, return_tensors="pt").to(DEVICE)
    with torch.no_grad():
        outputs = image_model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits, dim=1).squeeze().tolist()
    labels = image_model.config.id2label
    results = {labels[i]: round(probs[i], 3) for i in range(len(probs))}
    return results

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)
    file_path = sys.argv[1]
    ext = Path(file_path).suffix.lower()
    try:
        if ext in [".jpg", ".jpeg", ".png", ".bmp"]:
            # Image inference
            result = classify_image(file_path)
            print(json.dumps({"type": "image", "result": result}))
        elif ext in [".mp4", ".avi", ".mov", ".mkv"]:
            # Video inference
            frames = extract_frames(file_path, MAX_FRAMES)
            if len(frames) == 0:
                print(json.dumps({"error": "No frames extracted from video"}))
                sys.exit(1)
            model, vae = load_genconvit_model(MODEL_WEIGHTS, VAE_WEIGHTS, DEVICE)
            frames_tensor = preprocess_frames(frames, DEVICE)
            probs = predict_video(model, frames_tensor)
            video_pred = probs.mean(axis=0)
            labels = ["Realism", "Deepfake"]
            result = {labels[i]: float(video_pred[i]) for i in range(len(labels))}
            print(json.dumps({"type": "video", "result": result}))
        else:
            print(json.dumps({"error": "Unsupported file type"}))
            sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
