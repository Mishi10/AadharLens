# #installing dependencies
# import numpy as np
# from PIL import Image
# import pytesseract
# import matplotlib.pyplot as plt
# import re
# from datetime import datetime
# import cv2

# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# def preprocess_image_for_ocr(pil_img):
#     # Convert PIL to OpenCV format
#     cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)

#     # Optional: Resize for better accuracy
#     cv_img = cv2.resize(cv_img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

#     # Threshold to remove noise
#     cv_img = cv2.adaptiveThreshold(
#         cv_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
#     )

#     return Image.fromarray(cv_img)

# def extract_dob_and_age(image_path):
#     # Extract text from image
#     img = Image.open(image_path)
#     preprocessed = preprocess_image_for_ocr(img)
#     text = pytesseract.image_to_string(preprocessed, config="--psm 6")

#     print("🔍 OCR TEXT:\n", text)  # DEBUGGING

#     # Extract dob using regex
#     dob_matches = re.findall(r'\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{4}/\d{2}/\d{2}', text)
#     if dob_matches:
#         dob_str = dob_matches[0]
#         print(f"\n📅 Extracted DOB: {dob_str}")
        
#         # different dob formats
#         dob_format = ["%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%Y/%m/%d"]

#         # Calculate age
#         for fmt in dob_format:
#             try:
#                 dob = datetime.strptime(dob_str, fmt)
#                 break
#             except ValueError:
#                 continue
#         else:
#             print("Could not parse DOB format.")
#             dob = None

#         if dob:
#             age = (datetime.now() - dob).days // 365
#         else:
#             print("⚠️ DOB not found.")

#         return {
#             "dob": dob.strftime("%Y-%m-%d"),
#             "age": age,
#             "is_18_plus": age >= 18,
#             "error": None
#         }
    
# # sample = extract_dob_and_age("uploads/fake2.jpg")
# # print(f"DOB: ", sample["dob"])
# # print(f"Age:",sample["age"])

# Installing dependencies
import numpy as np
from PIL import Image
import pytesseract
import re
from datetime import datetime
import cv2

# Point to tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image_for_ocr(pil_img):
    # Convert PIL image to grayscale OpenCV format
    cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)

    # Resize for better OCR accuracy
    cv_img = cv2.resize(cv_img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # Apply adaptive thresholding
    cv_img = cv2.adaptiveThreshold(
        cv_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    return Image.fromarray(cv_img)

def clean_dob_string(dob_str):
    # Correct common OCR misreads
    return dob_str.replace('I', '1').replace('|', '1').replace('l', '1').replace('O', '0')

def extract_dob_and_age(image_path):
    img = Image.open(image_path)
    preprocessed = preprocess_image_for_ocr(img)
    text = pytesseract.image_to_string(preprocessed, config="--psm 6")

    print("🔍 OCR TEXT:\n", repr(text))  # Debug actual text

    # Extract possible DOB formats even with OCR mistakes
    dob_matches = re.findall(r'[\dIl|O]{2}[-/][\dIl|O]{2}[-/][\dIl|O]{4}', text)

    if dob_matches:
        raw_dob = dob_matches[0]
        cleaned_dob = clean_dob_string(raw_dob)

        print(f"\n📅 Extracted DOB (cleaned): {cleaned_dob}")

        dob_formats = ["%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%Y/%m/%d"]

        for fmt in dob_formats:
            try:
                dob = datetime.strptime(cleaned_dob, fmt)
                break
            except ValueError:
                continue
        else:
            print("⚠️ Could not parse DOB format.")
            return {
                "dob": None,
                "age": None,
                "is_18_plus": False,
                "error": "DOB format not recognized",
                "raw_text": text
            }

        age = (datetime.now() - dob).days // 365
        return {
            "dob": dob.strftime("%Y-%m-%d"),
            "age": age,
            "is_18_plus": age >= 18,
            "error": None,
            "raw_text": text
        }

    else:
        print("⚠️ No DOB-like string found.")
        return {
            "dob": None,
            "age": None,
            "is_18_plus": False,
            "error": "No DOB found",
            "raw_text": text
        }
