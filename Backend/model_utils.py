import os
import cv2
import numpy as np

def get_images_and_labels(dataset_path="dataset"):
    face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    face_samples = []
    labels = []
    label_map = {}
    current_label = 0

    for person in os.listdir(dataset_path):
        person_folder = os.path.join(dataset_path, person)
        if not os.path.isdir(person_folder): continue

        label_map[current_label] = person

        for img_name in os.listdir(person_folder):
            img_path = os.path.join(person_folder, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            faces = face_classifier.detectMultiScale(img, 1.3, 5)

            for (x, y, w, h) in faces:
                face_samples.append(img[y:y+h, x:x+w])
                labels.append(current_label)

        current_label += 1

    return face_samples, labels, label_map

def train_model(model_path="face_model.xml"):
    faces, labels, label_map = get_images_and_labels()
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(faces, np.array(labels))
    recognizer.save(model_path)

    # Save label map
    import pickle
    with open("label_map.pkl", "wb") as f:
        pickle.dump(label_map, f)

def load_model(model_path="face_model.xml"):
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(model_path)
    return recognizer
