from flask import Blueprint, request, jsonify
import requests
from io import BytesIO
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
from PIL import Image
from advertorch.attacks import FGSM

adversarial_attacks_bp = Blueprint('adversarial_attacks', __name__)

def fetch_image_from_url(image_url):
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content)).convert('RGB')
    return image

def load_image(image):
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    return preprocess(image).unsqueeze(0)

@adversarial_attacks_bp.route('/fgsm_attack', methods=['POST'])
def fgsm_attack():
    data = request.json
    image_url = data.get('image_url')
    epsilon = data.get('epsilon', 0.03)

    if not image_url:
        return jsonify({'error': 'Image URL is required.'}), 400

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = resnet50(pretrained=True).to(device).eval()

    try:
        image = fetch_image_from_url(image_url)
        image = load_image(image).to(device)
        image.requires_grad = True

        adversary = FGSM(model, eps=epsilon)
        adv_image = adversary.perturb(image)

        adv_image_pil = transforms.ToPILImage()(adv_image.squeeze(0).cpu())
        buffered = BytesIO()
        adv_image_pil.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        return jsonify({'adversarial_image': img_str})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
