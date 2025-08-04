import tensorflow as tf
import numpy as np
from tensorflow import keras

# Load MNIST for demo purposes (replace with your emotion dataset)
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Reshape and normalize data for emotion detection (48x48 grayscale)
x_train = tf.image.resize(x_train[..., tf.newaxis], (48, 48)) / 255.0
x_test = tf.image.resize(x_test[..., tf.newaxis], (48, 48)) / 255.0

# Create datasets
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train)).batch(32)
val_dataset = tf.data.Dataset.from_tensor_slices((x_test, y_test)).batch(32)

data = tf.keras.datasets.fashion_mnist

(training_images, training_labels), (test_images, test_labels) = data.load_data()


training_images = training_images / 255.0
test_images = test_images / 255.0

model = tf.keras.models.Sequential([
     tf.keras.layers.Flatten(input_shape=(28, 28)),
     tf.keras.layers.Dense(128, activation=tf.nn.relu),
     tf.keras.layers.Dense(10, activation=tf.nn.softmax)
])


# Simple CNN model for emotion detection
model = tf.keras.models.Sequential([
  tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(48,48,1)),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(10, activation='softmax')  # 10 classes for MNIST demo
])


model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(training_images, training_labels, epochs=5)

# Training
model.fit(train_dataset,
          validation_data=val_dataset,
          epochs=5,
          callbacks=[tf.keras.callbacks.EarlyStopping(patience=3)])

# Save the model
model.save('emotion_model.h5')
print("Model saved as emotion_model.h5")

# For actual emotion detection, replace the above with:
"""
# Emotion detection model (7 emotions)
emotion_model = tf.keras.models.Sequential([
  tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(48,48,1)),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(7, activation='softmax')  # 7 emotions
])

emotion_model.compile(optimizer='adam',
                      loss='sparse_categorical_crossentropy',
                      metrics=['accuracy'])

# Train with your emotion dataset
emotion_model.fit(train_dataset,
                  validation_data=val_dataset,
                  epochs=30,
                  callbacks=[tf.keras.callbacks.EarlyStopping(patience=3)])

emotion_model.save('emotion_model.h5')
"""
