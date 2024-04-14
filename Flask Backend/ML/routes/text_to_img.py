from flask import Blueprint, request, jsonify
import torch
from diffusers import StableDiffusionPipeline

text_to_image = Blueprint('text_to_image', __name__)

device = "cuda" if torch.cuda.is_available() else "cpu"
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to(device)

@text_to_image.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    image = pipe(prompt).images[0]

    image_bytes = image.cpu().numpy().tobytes()

    return jsonify({'image': image_bytes})
