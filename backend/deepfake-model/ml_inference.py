import sys, json
from pathlib import Path
from PIL import Image
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification, pipeline

file_path = sys.argv[1]
ext = Path(file_path).suffix.lower()

# --- Image Model ---
IMAGE_MODEL = "prithivMLmods/Deep-Fake-Detector-v2-Model"
image_processor = AutoImageProcessor.from_pretrained(IMAGE_MODEL)
image_model = AutoModelForImageClassification.from_pretrained(IMAGE_MODEL)

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
    file_path = sys.argv[1]  # Pass image path as argument
    result = classify_image(file_path)
    print(json.dumps(result, indent=2))
