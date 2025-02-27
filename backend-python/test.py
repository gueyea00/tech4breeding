import numpy as np
import tensorflow as tf
from PIL import Image

# Constants
IMG_SIZE = 128  # Must match the size used during training
CATEGORIES = ["cocci", "healthy", "ncd", "salmo"]  # Your class labels

# Load the trained model
model = tf.keras.models.load_model("chicken_health_model.h5")


# Function to preprocess a new image
def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.resize((IMG_SIZE, IMG_SIZE))  # Resize to match input shape
    img_array = np.array(img) / 255.0  # Normalize pixel values
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array


# Function to make predictions
def predict_image(image_path):
    # Preprocess the image
    img_array = preprocess_image(image_path)

    # Predict the class probabilities
    predictions = model.predict(img_array)

    # Get the predicted class (index of max probability)
    predicted_class_index = np.argmax(predictions)
    predicted_class = CATEGORIES[predicted_class_index]

    # Output the result
    print(f"Prediction: {predicted_class} (Confidence: {predictions[0][predicted_class_index] * 100:.2f}%)")


# Test with a new image
image_path = r"poulet.jpg"  # Replace with the path to your image
predict_image(image_path)
