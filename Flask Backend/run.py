from flask import Flask
from flask_cors import CORS
# from ML.routes.img_to_generate_image import img_to_generate_image_bp
# from ML.routes.text_to_img import text_to_image
# from ML.routes.denoise_image import denoise_image_bp
from ML.routes.adversarial_attacks import adversarial_attacks_bp
app = Flask(__name__)
CORS(app)
app.config['TRAP_BAD_REQUEST_ERRORS'] = True
# app.register_blueprint(img_to_generate_image_bp, url_prefix='/api')
# app.register_blueprint(text_to_image, url_prefix='/api')
app.register_blueprint(adversarial_attacks_bp,url_prefix='/api')
if __name__ == '__main__':
    app.run(debug=True)
