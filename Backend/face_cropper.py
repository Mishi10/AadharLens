# face_cropper.py
import cv2
import os

def crop_face(image_path, save_path=None):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    if len(faces) == 0:
        return None

    for (x, y, w, h) in faces:
        face_img = img[y:y+h, x:x+w]
        if save_path:
            cv2.imwrite(save_path, face_img)
        return save_path if save_path else face_img
