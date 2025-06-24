import cv2
import os
import numpy as np
import pickle

# Path to your dataset folder
DATASET_PATH = "dataset"
MODEL_PATH = "face_model.xml"
LABEL_MAP_PATH = "label_map.pkl"

# Haarcascade face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# Prepare data
faces = []
labels = []
label_map = {}
label_id = 0

print("🔄 Scanning dataset and preparing training data...")

for person_folder in os.listdir(DATASET_PATH):
    person_path = os.path.join(DATASET_PATH, person_folder)
    if not os.path.isdir(person_path):
        continue

    print(f"📂 Processing: {person_folder}")
    label_map[label_id] = person_folder

    for img_file in os.listdir(person_path):
        img_path = os.path.join(person_path, img_file)

        img = cv2.imread(img_path)
        if img is None:
            print(f"⚠️ Skipped unreadable image: {img_path}")
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        detected_faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in detected_faces:
            face = gray[y:y+h, x:x+w]
            face_resized = cv2.resize(face, (200, 200))  # Normalize size
            faces.append(face_resized)
            labels.append(label_id)
            break  # take only one face per image

    label_id += 1

if not faces:
    print("❌ No faces found. Make sure your dataset contains clear images.")
    exit()

# Convert to numpy arrays
faces_np = np.array(faces)
labels_np = np.array(labels)

# Train recognizer
print("🧠 Training LBPH model...")
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces_np, labels_np)

# Save model & label map
recognizer.save(MODEL_PATH)
with open(LABEL_MAP_PATH, "wb") as f:
    pickle.dump(label_map, f)

print(f"\n✅ Training complete!")
print(f"📁 Model saved as: {MODEL_PATH}")
print(f"📁 Label map saved as: {LABEL_MAP_PATH}")
