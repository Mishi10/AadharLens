import cv2
import pickle

def recognize_face(image_path, model_path="face_model.xml"):
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(model_path)

    with open("label_map.pkl", "rb") as f:
        label_map = pickle.load(f)

    face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    faces = face_classifier.detectMultiScale(img, 1.3, 5)

    for (x, y, w, h) in faces:
        roi = img[y:y+h, x:x+w]
        label, confidence = recognizer.predict(roi)
        return {
            "name": label_map[label],
            "confidence": round(100 - confidence, 2)  # higher = better
        }

    return {"error": "No face found"}
