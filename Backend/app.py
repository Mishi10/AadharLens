from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from PIL import Image
import cv2
from pdf2image import convert_from_path
from ocr_utils import extract_dob_and_age

app = Flask(__name__)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Flask backend is running."

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    ext = file.filename.split('.')[-1].lower()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    base_filename = f"{timestamp}_{file.filename.rsplit('.', 1)[0]}"
    saved_images = []

    ocr_result = {}

    if ext == "pdf":
        temp_pdf_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}.pdf")
        file.save(temp_pdf_path)

        images = convert_from_path(temp_pdf_path)
        for idx, img in enumerate(images):
            image_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}_page{idx + 1}.jpg")
            img.save(image_path, "JPEG")
            saved_images.append(image_path)

        os.remove(temp_pdf_path)

        if saved_images:
            # Run OCR on the first page only (you can loop through all if needed)
            ocr_result = extract_dob_and_age(saved_images[0])

    elif ext in ["jpg", "jpeg", "png", "bmp"]:
        image_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}.{ext}")
        file.save(image_path)
        saved_images.append(image_path)

        # Run OCR on the image
        ocr_result = extract_dob_and_age(image_path)

    else:
        return jsonify({"error": "Unsupported file type"}), 400

    return jsonify({
        "message": "Processed successfully",
        "images": saved_images,
        "ocr": ocr_result
    }), 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)
