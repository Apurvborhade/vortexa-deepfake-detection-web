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




import sys, json, cv2
from pathlib import Path

file_path = sys.argv[1]
file_ext = Path(file_path).suffix.lower()

result = {}

if file_ext in [".mp4", ".mov", ".avi"]:
    cap = cv2.VideoCapture(file_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    # Sample every 5th frame to reduce computation
    frames = frames[::5]

    # Dummy prediction logic (replace with model)
    frame_preds = []
    for i, frame in enumerate(frames):
        # label, conf = your_model_predict(frame)
        label, conf = "Fake", 0.87  # example
        frame_preds.append({"frame": i, "label": label, "confidence": conf})

    # Aggregate overall video label (majority vote)
    fake_count = sum(1 for f in frame_preds if f["label"].lower() == "fake")
    real_count = len(frame_preds) - fake_count
    overall_label = "Fake" if fake_count > real_count else "Real"

    result = {"type": "video", "overall_label": overall_label, "frames": frame_preds}

else:
    result = {"error": "Unsupported file type"}

print(json.dumps(result))