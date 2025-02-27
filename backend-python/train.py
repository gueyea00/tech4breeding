import os
import numpy as np
import tensorflow as tf
from PIL import Image
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelBinarizer

# Constants
BASE_DIR = r"C:\Users\gueye\Desktop\chicken_health_multiclass"
CATEGORIES = ["cocci", "healthy", "ncd", "salmo"]
IMG_SIZE = 128
BATCH_SIZE = 32
EPOCHS = 10

# Function to load and preprocess images using PIL
def load_data(base_dir, categories):
    images = []
    labels = []
    for category in categories:
        category_path = os.path.join(base_dir, category)
        print(f"Loading images from: {category_path}")
        for img_name in os.listdir(category_path):
            try:
                img_path = os.path.join(category_path, img_name)
                # Open image, resize, and normalize
                with Image.open(img_path) as img:
                    img = img.resize((IMG_SIZE, IMG_SIZE))
                    img_array = np.array(img) / 255.0  # Normalize pixel values
                    if img_array.shape == (IMG_SIZE, IMG_SIZE, 3):  # Ensure RGB
                        images.append(img_array)
                        labels.append(category)
            except Exception as e:
                print(f"Error loading image {img_path}: {e}")
    return np.array(images), np.array(labels)

# Load and preprocess data
print(f"Loading data from '{BASE_DIR}'...")
X, y = load_data(BASE_DIR, CATEGORIES)
print(f"Loaded {len(X)} images.")

# Encode labels
lb = LabelBinarizer()
y_encoded = lb.fit_transform(y)

# Split data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Create TensorFlow dataset
train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
val_dataset = tf.data.Dataset.from_tensor_slices((X_val, y_val))

# Shuffle, batch, and prefetch the data for training and validation
train_dataset = train_dataset.shuffle(buffer_size=1000).batch(BATCH_SIZE).prefetch(tf.data.experimental.AUTOTUNE)
val_dataset = val_dataset.batch(BATCH_SIZE).prefetch(tf.data.experimental.AUTOTUNE)

# Model definition
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(CATEGORIES), activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model using the TensorFlow dataset
print("Training model...")
history = model.fit(train_dataset, validation_data=val_dataset, epochs=EPOCHS)

# Save the model
model.save("chicken_health_model.h5")
print("Model saved as 'chicken_health_model.h5'.")
