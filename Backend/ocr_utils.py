#installing dependencies
from PIL import Image
import pytesseract
import matplotlib.pyplot as plt
import re
from datetime import datetime

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_dob_and_age(image_path):
    # Extract text from image
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)

    # Extract dob using regex
    dob_matches = re.findall(r'\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{4}/\d{2}/\d{2}', text)
    if dob_matches:
        dob_str = dob_matches[0]
        print(f"\n📅 Extracted DOB: {dob_str}")
        
        # different dob formats
        dob_format = ["%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%Y/%m/%d"]

        # Calculate age
        for fmt in dob_format:
            try:
                dob = datetime.strptime(dob_str, fmt)
                break
            except ValueError:
                continue
        else:
            print("Could not parse DOB format.")
            dob = None

        if dob:
            age = (datetime.now() - dob).days // 365
        else:
            print("⚠️ DOB not found.")

        return {
            "dob": dob.strftime("%Y-%m-%d"),
            "age": age,
            "is_18_plus": age >= 18,
            "error": None
        }

sample = extract_dob_and_age("uploads/fake2.jpg")
print(f"DOB: ", sample["dob"])
print(f"Age:",sample["age"])