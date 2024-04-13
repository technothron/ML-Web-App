from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import requests
from PIL import Image
from io import BytesIO

denoise_image_bp = Blueprint('denoise_image', __name__)

def download_image(url):
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
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
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required.'}), 400

    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch image.'}), 400

    original_image = download_image(url)
    
    noisy_image = add_gaussian_noise(original_image)

    denoised_image = denoise_image(noisy_image)

    original_bytes = BytesIO()
    Image.fromarray(original_image).save(original_bytes, format='PNG')
    original_base64 = original_bytes.getvalue()

    noisy_bytes = BytesIO()
    Image.fromarray(noisy_image).save(noisy_bytes, format='PNG')
    noisy_base64 = noisy_bytes.getvalue()

    denoised_bytes = BytesIO()
    Image.fromarray(denoised_image).save(denoised_bytes, format='PNG')
    denoised_base64 = denoised_bytes.getvalue()

    return jsonify({
        'original_image': original_base64.decode('latin1'),
        'noisy_image': noisy_base64.decode('latin1'),
        'denoised_image': denoised_base64.decode('latin1')
    })
