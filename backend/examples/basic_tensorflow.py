#!/usr/bin/env python3
"""
Basic TensorFlow Example
Demonstrates how to use TensorFlow for emotion detection
"""

import tensorflow as tf
import numpy as np
import cv2
from tensorflow import keras

def create_simple_model():
    """Create a simple CNN model for emotion detection"""
    model = keras.Sequential([
        keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
        keras.layers.MaxPooling2D((2, 2)),
        keras.layers.Conv2D(64, (3, 3), activation='relu'),
        keras.layers.MaxPooling2D((2, 2)),
        keras.layers.Flatten(),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dense(7, activation='softmax')  # 7 emotions
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def preprocess_image(image_path):
    """Preprocess an image for emotion detection"""
    # Load and resize image
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (48, 48))
    
    # Normalize
    img = img.astype('float32') / 255.0
    
    # Add batch and channel dimensions
    img = np.expand_dims(img, axis=[0, -1])  # Shape: (1, 48, 48, 1)
    
    return img

def predict_emotion(model, image_path):
    """Predict emotion from an image"""
    # Preprocess image
    img = preprocess_image(image_path)
    
    # Make prediction
    prediction = model.predict(img)
    emotion_index = np.argmax(prediction[0])
    confidence = np.max(prediction[0])
    
    # Emotion labels
    emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    
    return {
        'emotion': emotions[emotion_index],
        'confidence': float(confidence),
        'predictions': prediction[0].tolist()
    }

def main():
    """Main function demonstrating TensorFlow usage"""
    print("🧠 TensorFlow Emotion Detection Example")
    print("=" * 40)
    
    # Check TensorFlow version
    print(f"TensorFlow version: {tf.__version__}")
    
    # Create model
    print("\n📊 Creating model...")
    model = create_simple_model()
    print("✅ Model created successfully!")
    
    # Model summary
    print("\n📋 Model Architecture:")
    model.summary()
    
    # Example usage (with dummy data)
    print("\n🎭 Example prediction (with dummy data):")
    
    # Create dummy image data
    dummy_image = np.random.random((48, 48)).astype('float32')
    dummy_image = np.expand_dims(dummy_image, axis=[0, -1])
    
    # Make prediction
    prediction = model.predict(dummy_image)
    emotion_index = np.argmax(prediction[0])
    emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    
    print(f"   Predicted emotion: {emotions[emotion_index]}")
    print(f"   Confidence: {np.max(prediction[0]):.2f}")
    
    # Save model
    print("\n💾 Saving model...")
    model.save('models/emotion_model_example.h5')
    print("✅ Model saved as 'models/emotion_model_example.h5'")
    
    print("\n🎉 Example completed successfully!")
    print("\nNext steps:")
    print("1. Train the model with real emotion data")
    print("2. Use the model in your FastAPI application")
    print("3. Convert to TensorFlow.js for frontend use")

if __name__ == "__main__":
    main() 