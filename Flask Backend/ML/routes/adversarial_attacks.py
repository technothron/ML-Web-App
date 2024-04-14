from flask import Blueprint, request, jsonify
import requests
from io import BytesIO
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50
from PIL import Image
from advertorch.attacks import (
    FGSM,
    GradientAttack,
    GradientSignAttack,
    FastFeatureAttack,
    L2BasicIterativeAttack,
    LinfBasicIterativeAttack,
    PGDAttack,
    LinfPGDAttack,
    L2PGDAttack,
    L1PGDAttack,
    SparseL1DescentAttack,
    MomentumIterativeAttack,
    LinfMomentumIterativeAttack,
    L2MomentumIterativeAttack,
    CarliniWagnerL2Attack,
    ElasticNetL1Attack,
    DDNL2Attack,
    LBFGSAttack,
    SinglePixelAttack,
    LocalSearchAttack,
    SpatialTransformAttack,
    JacobianSaliencyMapAttack
)

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

@adversarial_attacks_bp.route('/FGSM', methods=['POST'])
def FGSM():
    return attack(FGSM)

@adversarial_attacks_bp.route('/gradient_attack', methods=['POST'])
def gradient_attack():
    return attack(GradientAttack)

@adversarial_attacks_bp.route('/gradient_sign_attack', methods=['POST'])
def gradient_sign_attack():
    return attack(GradientSignAttack)

@adversarial_attacks_bp.route('/fast_feature_attack', methods=['POST'])
def fast_feature_attack():
    return attack(FastFeatureAttack)

@adversarial_attacks_bp.route('/l2_basic_iterative_attack', methods=['POST'])
def l2_basic_iterative_attack():
    return attack(L2BasicIterativeAttack)

@adversarial_attacks_bp.route('/linf_basic_iterative_attack', methods=['POST'])
def linf_basic_iterative_attack():
    return attack(LinfBasicIterativeAttack)

@adversarial_attacks_bp.route('/pgd_attack', methods=['POST'])
def pgd_attack():
    return attack(PGDAttack)

@adversarial_attacks_bp.route('/linf_pgd_attack', methods=['POST'])
def linf_pgd_attack():
    return attack(LinfPGDAttack)

@adversarial_attacks_bp.route('/l2_pgd_attack', methods=['POST'])
def l2_pgd_attack():
    return attack(L2PGDAttack)

@adversarial_attacks_bp.route('/l1_pgd_attack', methods=['POST'])
def l1_pgd_attack():
    return attack(L1PGDAttack)

@adversarial_attacks_bp.route('/sparse_l1_descent_attack', methods=['POST'])
def sparse_l1_descent_attack():
    return attack(SparseL1DescentAttack)

@adversarial_attacks_bp.route('/momentum_iterative_attack', methods=['POST'])
def momentum_iterative_attack():
    return attack(MomentumIterativeAttack)

@adversarial_attacks_bp.route('/linf_momentum_iterative_attack', methods=['POST'])
def linf_momentum_iterative_attack():
    return attack(LinfMomentumIterativeAttack)

@adversarial_attacks_bp.route('/l2_momentum_iterative_attack', methods=['POST'])
def l2_momentum_iterative_attack():
    return attack(L2MomentumIterativeAttack)

@adversarial_attacks_bp.route('/carlini_wagner_l2_attack', methods=['POST'])
def carlini_wagner_l2_attack():
    return attack(CarliniWagnerL2Attack)

@adversarial_attacks_bp.route('/elastic_net_l1_attack', methods=['POST'])
def elastic_net_l1_attack():
    return attack(ElasticNetL1Attack)

@adversarial_attacks_bp.route('/ddn_l2_attack', methods=['POST'])
def ddn_l2_attack():
    return attack(DDNL2Attack)

@adversarial_attacks_bp.route('/lbfgs_attack', methods=['POST'])
def lbfgs_attack():
    return attack(LBFGSAttack)

@adversarial_attacks_bp.route('/single_pixel_attack', methods=['POST'])
def single_pixel_attack():
    return attack(SinglePixelAttack)

@adversarial_attacks_bp.route('/local_search_attack', methods=['POST'])
def local_search_attack():
    return attack(LocalSearchAttack)

@adversarial_attacks_bp.route('/spatial_transform_attack', methods=['POST'])
def spatial_transform_attack():
    return attack(SpatialTransformAttack)

@adversarial_attacks_bp.route('/jacobian_saliency_map_attack', methods=['POST'])
def jacobian_saliency_map_attack():
    return attack(JacobianSaliencyMapAttack)

def attack(Attack):
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
        # not using epsilon
        # default epsilon is used in libary
        # library has more parameter 
        # hum baad me add kar sakte h need ke according
        if Attack==FGSM:
            adversary = Attack(model,eps=epsilon)
            adv_image = adversary.perturb(image)            
        if Attack==CarliniWagnerL2Attack or Attack==ElasticNetL1Attack or Attack==LBFGSAttack or Attack==SpatialTransformAttack or Attack==JacobianSaliencyMapAttack:
            adversary = Attack(model,num_classes=1000)
            adv_image = adversary.perturb(image)
        elif Attack==FastFeatureAttack:
            adversary = Attack(model)
            adv_image = adversary.perturb(image,image)  
        else:
            adversary = Attack(model)
            adv_image = adversary.perturb(image)
        # adversary = Attack(model)
        # adv_image = adversary.perturb(image)

        adv_image_pil = transforms.ToPILImage()(adv_image.squeeze(0).cpu())
        buffered = BytesIO()
        adv_image_pil.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        return jsonify({'adversarial_image': img_str})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
