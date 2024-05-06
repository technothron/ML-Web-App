from flask import Blueprint, request, Response
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
    data = request.data
    prompt = request.args.get('prompt')

    if not data or not prompt:
        return 'URL and prompt both are required.', 400

    try:
        init_image = Image.open(BytesIO(data)).convert("RGB")
        init_image.thumbnail((768, 768))

        generator = torch.Generator(device=device).manual_seed(1024)
        image = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5, generator=generator).images[0]

        img_byte_array = BytesIO()
        image.save(img_byte_array, format='JPEG')
        img_byte_array.seek(0)

        # return Response(img_byte_array, mimetype='image/jpeg')
        return img_byte_array.getvalue(), 200, {'Content-Type': 'image/jpeg'}
    except Exception as e:
        return str(e), 500
