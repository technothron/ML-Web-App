from flask import Blueprint, request, jsonify
import torch
import requests
from PIL import Image
from io import BytesIO
from diffusers import StableDiffusionImg2ImgPipeline

img_to_generate_image_bp = Blueprint('img_to_generate_image', __name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
pipe = StableDiffusionImg2ImgPipeline.from_pretrained("nitrosocke/Ghibli-Diffusion", torch_dtype=torch.float16).to(
    device
)

@img_to_generate_image_bp.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.json
    url = data.get('url')
    prompt = data.get('prompt')

    if not url or not prompt:
        return jsonify({'error': 'URL and prompt are required.'}), 400

    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch image.'}), 400

    init_image = Image.open(BytesIO(response.content)).convert("RGB")
    init_image.thumbnail((768, 768))

    generator = torch.Generator(device=device).manual_seed(1024)
    try:
        image = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5, generator=generator).images[0]
        img_byte_array = BytesIO()
        image.save(img_byte_array, format='JPEG')
        img_byte_array = img_byte_array.getvalue()
        return jsonify({'image': img_byte_array.decode('latin1')})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
