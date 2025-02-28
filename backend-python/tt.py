from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Charger le modèle d'IA
model = tf.keras.models.load_model(r"C:\Users\gueye\Desktop\chicken_health_multiclass")

CATEGORIES = ["cocci", "healthy", "ncd", "salmo"]

@app.route('/analyze-feces', methods=['POST'])
def analyze_feces():
    # Récupérer l'image envoyée par le client (base64)
    data = request.get_json()
    image_data = data['image']

    # Décoder l'image
    image_data = base64.b64decode(image_data.split(',')[1])  # Suppression du préfixe 'data:image/jpeg;base64,'
    image = Image.open(io.BytesIO(image_data))

    # Prétraiter l'image pour le modèle d'IA
    image = image.resize((224, 224))  # Modifier la taille de l'image si nécessaire
    image = np.array(image) / 255.0  # Normaliser l'image
    image = np.expand_dims(image, axis=0)  # Ajouter une dimension pour le batch

    # Prédiction
    prediction = model.predict(image)
    predicted_class = np.argmax(prediction, axis=1)[0]
    result = CATEGORIES[predicted_class]

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
