from PIL import Image
import numpy as np
import cv2

# Load the black-and-white image
image_path = "./esp32.png"  # Replace with your image path
img = Image.open(image_path).convert("L")  # Convert to grayscale
img_np = np.array(img)

# Threshold to binary (black = object, white = background)
_, binary = cv2.threshold(img_np, 127, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Convert contours to SVG path
svg_paths = []
for contour in contours:
    if len(contour) > 1:
        path_data = "M " + " L ".join(f"{pt[0][0]},{pt[0][1]}" for pt in contour) + " Z"
        svg_paths.append(path_data)

# Combine all paths into one string
final_svg_path = "\n".join([f'<path d="{d}" fill="black"/>' for d in svg_paths])

# Print or save
print(final_svg_path)