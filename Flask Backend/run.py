from flask import Flask
from ML.routes.img_to_generate_image import img_to_generate_image_bp
from ML.routes.denoise_image import denoise_image_bp
from ML.routes.adversarial_attacks import adversarial_attacks_bp
app = Flask(__name__)

app.register_blueprint(img_to_generate_image_bp, url_prefix='/api')
app.register_blueprint(denoise_image_bp, url_prefix='/api')
app.register_blueprint(adversarial_attacks_bp,url_prefix='/api')
app.register_blueprint(img_to_generate_image_bp,url_prefix='/api')
if __name__ == '__main__':
    app.run(debug=True)
