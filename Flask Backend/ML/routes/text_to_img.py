from flask import Blueprint, request, Response
import torch
from diffusers import StableDiffusionPipeline

text_to_image = Blueprint('text_to_image', __name__)

device = "cuda" if torch.cuda.is_available() else "cpu"
# pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16).to(device)
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5").to(device)

@text_to_image.route('/generate_image_via_text', methods=['POST'])
def generate_image():
    prompt = request.data.decode('utf-8')

    if not prompt:
        return 'Prompt is required.', 400

    image = pipe(prompt).images[0]

    image_bytes = image.tobytes()

    return image_bytes, 200, {'Content-Type': 'application/octet-stream'}
