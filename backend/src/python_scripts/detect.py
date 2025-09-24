import sys, json
from pathlib import Path

file_path = sys.argv[1]
file_ext = Path(file_path).suffix.lower()

result = {}

if file_ext in [".jpg", ".png", ".jpeg"]:
    # Replace with your model logic
    label, conf = "Fake", 0.87
    result = {"type": "image", "label": label, "confidence": conf}

elif file_ext in [".mp4", ".mov", ".avi"]:
    # Replace with your model logic
    label = "Real"
    result = {"type": "video", "label": label}

print(json.dumps(result))
