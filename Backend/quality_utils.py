import cv2

def is_blurry(image_path, threshold=100):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    lap_var = cv2.Laplacian(image, cv2.CV_64F).var()
    return lap_var < threshold  # True = blurry

def is_proper_lighting(image_path, brightness_thresh=(50, 200)):
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if image is None:
        return False  # fail-safe
    avg_brightness = image.mean()
    print(f"💡 Brightness level: {avg_brightness}")  # DEBUG LINE
    return brightness_thresh[0] <= avg_brightness <= brightness_thresh[1]