import cv2
import os
import pickle
from face_cropper import crop_face

MODEL_PATH = "face_model.xml"
LABEL_MAP_PATH = "label_map.pkl"
HAAR_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

def recognize_face(image_path):
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(MODEL_PATH)

    with open(LABEL_MAP_PATH, "rb") as f:
        label_map = pickle.load(f)

    img_gray = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    face_cascade = cv2.CascadeClassifier(HAAR_PATH)
    faces = face_cascade.detectMultiScale(img_gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = img_gray[y:y+h, x:x+w]
        label, confidence = recognizer.predict(roi)
        return {
            "name": label_map.get(label, "Unknown"),
            "confidence": round(100 - confidence, 2)
        }

    return {"error": "No face found"}

def capture_and_recognize():
    cap = cv2.VideoCapture(0)
    print("📸 Press 's' to capture selfie or 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to access webcam.")
            break

        cv2.imshow("Selfie Recognition", frame)
        key = cv2.waitKey(1)

        if key == ord('s'):
            path = "uploads/selfie.jpg"
            cv2.imwrite(path, frame)
            print(f"✅ Selfie saved at {path}")

            # Crop face
            cropped_path = "uploads/selfie_cropped.jpg"
            result = crop_face(path, cropped_path)
            if not result:
                print("❌ No face detected for recognition.")
                continue

            # Recognize
            result = recognize_face(cropped_path)
            print("🧠 Recognition Result:", result)

            # Show result on image
            img = cv2.imread(path)
            cv2.putText(img, f"{result.get('name', 'Unknown')} ({result.get('confidence', 0)}%)",
                        (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.imshow("Recognition", img)
            cv2.waitKey(3000)

        elif key == ord('q'):
            print("👋 Exiting.")
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    capture_and_recognize()
