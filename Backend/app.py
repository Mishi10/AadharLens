from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import numpy as np
import base64
from PIL import Image
import cv2
from pdf2image import convert_from_path
from ocr_utils import extract_dob_and_age
from face_cropper import crop_face 
from face_match import recognize_face
from quality_utils import is_blurry, is_proper_lighting


app = Flask(__name__)
CORS(app, supports_credentials=True)
# CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Flask backend is running."

@app.route("/verify-face-match", methods=["POST"])
def verify_face():
    if "aadhaar" not in request.files or "selfie" not in request.files:
        return jsonify({"error": "Both Aadhaar and selfie are required"}), 400

    aadhaar_file = request.files["aadhaar"]
    selfie_file = request.files["selfie"]

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    aadhaar_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_aadhaar.jpg")
    selfie_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_selfie.jpg")
    cropped_aadhaar_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_aadhaar_face.jpg")
    cropped_selfie_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_selfie_face.jpg")

    # Save original images
    aadhaar_file.save(aadhaar_path)
    selfie_file.save(selfie_path)

    # ✅ Step 1: Run OCR on Aadhaar to extract DOB
    ocr_result = extract_dob_and_age(aadhaar_path)

    # ✅ Step 2: Crop faces
    if not crop_face(aadhaar_path, cropped_aadhaar_path):
        return jsonify({"error": "No face found in Aadhaar image"}), 400
    if not crop_face(selfie_path, cropped_selfie_path):
        return jsonify({"error": "No face found in Selfie image"}), 400
    
    # ✅ Step 3: Quality checks before recognition
    if is_blurry(cropped_selfie_path):
        return jsonify({"error": " face is too blurry"}), 400

    if not is_proper_lighting(cropped_selfie_path):
        return jsonify({"error": "Bad lighting in selfie image"}), 400

    # ✅ Step 4: Run face recognition
    aadhaar_face = recognize_face(cropped_aadhaar_path)
    selfie_face = recognize_face(cropped_selfie_path)

    # ✅ Step 5: Compare faces
    is_match = False
    if "name" in aadhaar_face and "name" in selfie_face:
        is_match = aadhaar_face["name"] == selfie_face["name"]
        if is_match:
            confidence = round((aadhaar_face["confidence"] + selfie_face["confidence"]) / 2, 2)

    # ✅ Step 6: Send match + DOB info to frontend
    return jsonify({
        "match": is_match,
        "ocr": ocr_result,
        "confidence":confidence
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)


# @app.route("/upload", methods=["POST"])
# def upload():
#     if "file" not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400

#     ext = file.filename.split('.')[-1].lower()
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     base_filename = f"{timestamp}_{file.filename.rsplit('.', 1)[0]}"
#     saved_images = []

#     ocr_result = {}

#     if ext == "pdf":
#         temp_pdf_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}.pdf")
#         file.save(temp_pdf_path)

#         images = convert_from_path(temp_pdf_path)
#         for idx, img in enumerate(images):
#             image_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}_page{idx + 1}.jpg")
#             img.save(image_path, "JPEG")
#             saved_images.append(image_path)

#         os.remove(temp_pdf_path)

#         if saved_images:
#             # Run OCR on the first page only (you can loop through all if needed)
#             ocr_result = extract_dob_and_age(saved_images[0])

#     elif ext in ["jpg", "jpeg", "png", "bmp"]:
#         image_path = os.path.join(UPLOAD_FOLDER, f"{base_filename}.{ext}")
#         file.save(image_path)
#         saved_images.append(image_path)

#         # Run OCR on the image
#         ocr_result = extract_dob_and_age(image_path)

#     else:
#         return jsonify({"error": "Unsupported file type"}), 400

#     return jsonify({
#         "message": "Processed successfully",
#         "images": saved_images,
#         "ocr": ocr_result
#     }), 200

# @app.route("/match-face", methods=["POST"])
# def match_face():
#     data = request.get_json()
#     selfie_data = data.get("selfie")

#     if not selfie_data:
#         return jsonify({"error": "Selfie image not provided"}), 400

#     try:
#         # Step 1: decode base64 selfie
#         header, encoded = selfie_data.split(",", 1)
#         selfie_bytes = base64.b64decode(encoded)
#         np_arr = np.frombuffer(selfie_bytes, np.uint8)
#         selfie_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

#         # Step 2: save & crop selfie
#         selfie_path = os.path.join(UPLOAD_FOLDER, "selfie.jpg")
#         cropped_selfie_path = os.path.join(UPLOAD_FOLDER, "selfie_cropped.jpg")
#         cv2.imwrite(selfie_path, selfie_img)

#         if not crop_face(selfie_path, cropped_selfie_path):
#             return jsonify({"error": "No face found in selfie"}), 400

#         # Step 3: match with Aadhaar/reference image
#         # Assume aadhaar image is already saved (e.g., uploaded earlier)
#         aadhaar_cropped_path = os.path.join(UPLOAD_FOLDER, "aadhaar_face.jpg")
#         if not os.path.exists(aadhaar_cropped_path):
#             return jsonify({"error": "Aadhaar face not available"}), 400

#         # Step 4: Compare face (selfie vs aadhaar)
#         selfie_result = recognize_face(cropped_selfie_path)
#         aadhaar_result = recognize_face(aadhaar_cropped_path)

#         # Step 5: Check if both have same label
#         if "name" in selfie_result and "name" in aadhaar_result:
#             is_match = selfie_result["name"] == aadhaar_result["name"]
#             return jsonify({
#                 "match": is_match,
#                 "selfie": selfie_result,
#                 "aadhaar": aadhaar_result
#             })

#         return jsonify({"error": "Recognition failed on one or both images"})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/verify-face-match", methods=["POST"])
# def verify_face():
#     if "aadhaar" not in request.files or "selfie" not in request.files:
#         return jsonify({"error": "Both Aadhaar and selfie are required"}), 400

#     aadhaar_file = request.files["aadhaar"]
#     selfie_file = request.files["selfie"]

#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     aadhaar_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_aadhaar.jpg")
#     selfie_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_selfie.jpg")
#     cropped_aadhaar_path = os.path.join(UPLOAD_FOLDER, f"{timestamp}_aadhaar_face.jpg")

#     aadhaar_file.save(aadhaar_path)
#     selfie_file.save(selfie_path)

#     result = crop_face(aadhaar_path, cropped_aadhaar_path)
#     if result is None:
#         return jsonify({"error": "No face found in Aadhaar image"}), 400

#     # Match Aadhaar face with selfie
  
#     match_result = recognize_face(cropped_aadhaar_path)

#     return jsonify(match_result)
