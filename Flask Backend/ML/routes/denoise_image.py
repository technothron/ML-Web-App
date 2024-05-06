from flask import Blueprint, request
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

denoise_image_bp = Blueprint('denoise_image', __name__)

def preprocess_image(image_data):
    image = Image.open(BytesIO(image_data))
    return np.array(image)

def add_gaussian_noise(image, mean=0, sigma=25):
    noise = np.random.normal(mean, sigma, image.shape).astype(np.uint8)
    noisy_image = cv2.add(image, noise)
    return noisy_image

def denoise_image(image):
    alpha = 0.1  # Controls the amount of diffusion
    K = 50     # Larger K reduces the effect of noise
    niters = 10  # Number of iterations

    denoised_image = cv2.ximgproc.anisotropicDiffusion(image, alpha=alpha, K=K, niters=niters)
    return denoised_image

@denoise_image_bp.route('/denoise_image', methods=['POST'])
def denoise_image():
    image_data = request.files['image'].read()

    if not image_data:
        return 'Image data is required.', 400

    original_image = preprocess_image(image_data)
    
    noisy_image = add_gaussian_noise(original_image)

    denoised_image = denoise_image(noisy_image)

    original_bytes = BytesIO()
    Image.fromarray(original_image).save(original_bytes, format='JPEG')
    original_bytes.seek(0)

    noisy_bytes = BytesIO()
    Image.fromarray(noisy_image).save(noisy_bytes, format='JPEG')
    noisy_bytes.seek(0)

    denoised_bytes = BytesIO()
    Image.fromarray(denoised_image).save(denoised_bytes, format='JPEG')
    denoised_bytes.seek(0)

    return original_bytes, noisy_bytes, denoised_bytes
