import base64
from io import BytesIO
import io
import os
import tensorflow as tf
from PIL import Image  # Assurez-vous d'importer Image de PIL (Pillow)
from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import Prediction, User, Enclos, Camera, Poulet, Observation


# Connexion à la base de données
DATABASE_URL = "postgresql://postgres:admin@localhost/db_app3"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = Flask(__name__)
CORS(app, origins="http://localhost:4200", supports_credentials=True)


IMG_SIZE = 128

# Charger le modèle TensorFlow ici
model = tf.keras.models.load_model('chicken_health_model.h5')

# Définir les catégories (modifiez-les selon votre modèle)
CATEGORIES = ["cocci", "healthy", "ncd", "salmo"]  # Your class labels

# Middleware pour gérer les erreurs globalement
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": str(e)}), 500

# Fonction générique pour créer des routes CRUD
def create_crud_routes(app, model, route_prefix, id_field):
    # GET all
    @app.route(f'/api/{route_prefix}', methods=['GET'], endpoint=f'get_all_{route_prefix}')
    def get_all():
        try:
            with SessionLocal() as session:
                items = session.query(model).all()
                return jsonify([item.as_dict() for item in items]), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        


    # GET by ID
    @app.route(f'/api/{route_prefix}/<int:id>', methods=['GET'], endpoint=f'get_by_id_{route_prefix}')
    def get_by_id(id):
        try:
            with SessionLocal() as session:
                item = session.query(model).filter(getattr(model, id_field) == id).first()
                if item:
                    return jsonify(item.as_dict()), 200
                return jsonify({"error": f"{model.__name__} non trouvé"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # POST (ajouter)
    @app.route(f'/api/{route_prefix}', methods=['POST'], endpoint=f'add_{route_prefix}')
    def add():
        data = request.get_json()
        try:
            with SessionLocal() as session:
                new_item = model(**data)
                session.add(new_item)
                session.commit()
                return jsonify({
                    "message": f"{model.__name__} ajouté avec succès",
                    f"{model.__name__.lower()}": new_item.as_dict()
                }), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # PUT (mettre à jour)
    @app.route(f'/api/{route_prefix}/<int:id>', methods=['PUT'], endpoint=f'update_{route_prefix}')
    def update(id):
        data = request.get_json()
        try:
            with SessionLocal() as session:
                item = session.query(model).filter(getattr(model, id_field) == id).first()
                if not item:
                    return jsonify({"error": f"{model.__name__} non trouvé"}), 404
                for key, value in data.items():
                    if hasattr(item, key):
                        setattr(item, key, value)
                session.commit()
                return jsonify({
                    "message": f"{model.__name__} mis à jour avec succès",
                    f"{model.__name__.lower()}": item.as_dict()
                }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # DELETE
    @app.route(f'/api/{route_prefix}/<int:id>', methods=['DELETE'], endpoint=f'delete_{route_prefix}')
    def delete(id):
        try:
            with SessionLocal() as session:
                item = session.query(model).filter(getattr(model, id_field) == id).first()
                if not item:
                    return jsonify({"error": f"{model.__name__} non trouvé"}), 404
                session.delete(item)
                session.commit()
                return jsonify({"message": f"{model.__name__} supprimé avec succès"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email et mot de passe sont requis"}), 400

    try:
        with SessionLocal() as session:
            user = session.query(User).filter(User.email == email).first()
            if not user or user.mot_de_passe != password:
                return jsonify({"error": "Email ou mot de passe incorrect"}), 401
            return jsonify({
                "message": "Connexion réussie",
                "user": user.as_dict()
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image reçue"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Nom de fichier vide"}), 400

    try:
        # Lecture de l'image en binaire
        img_binary = file.read()

        # Prétraitement de l'image
        img = Image.open(io.BytesIO(img_binary)).convert("RGB")
        img = img.resize((IMG_SIZE, IMG_SIZE))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Prédiction avec votre modèle TensorFlow
        predictions = model.predict(img_array)
        predicted_class_index = np.argmax(predictions)
        predicted_class = CATEGORIES[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index]) * 100

        # Sauvegarde de la prédiction et de l'image en BLOB dans la base de données
        with SessionLocal() as session:
            new_prediction = Prediction(
                class_predite=predicted_class,
                confiance=confidence,
                image=img_binary  # Sauvegarde de l'image en binaire
            )
            session.add(new_prediction)
            session.commit()

        return jsonify({"class": predicted_class, "confidence": confidence})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/predictions', methods=['GET'])
def get_predictions():
    try:
        with SessionLocal() as session:
            predictions = session.query(Prediction).all()
          # Convertir l'image en base64 pour pouvoir la renvoyer comme JSON
            for prediction in predictions:
                if prediction.image:  # Supposons que l'image est stockée dans `image_data`
                    prediction.image = base64.b64encode(prediction.image).decode('utf-8')
            return jsonify([prediction.as_dict() for prediction in predictions])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Création des routes pour chaque modèle
create_crud_routes(app, User, 'users', 'id_user')
create_crud_routes(app, Enclos, 'enclos', 'id_enclos')
create_crud_routes(app, Camera, 'cameras', 'id_camera')
create_crud_routes(app, Poulet, 'poulets', 'id_poulet')
create_crud_routes(app, Observation, 'observations', 'id_observation')
create_crud_routes(app, Prediction, 'predictions', 'id_prediction')

# Lancer l'application
if __name__ == "__main__":
    app.run(host='localhost', port=2025, debug=True)
