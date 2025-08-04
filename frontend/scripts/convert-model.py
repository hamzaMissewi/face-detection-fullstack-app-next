#!/usr/bin/env python3
"""
TensorFlow.js Model Converter Script

This script helps convert TensorFlow/Keras models to TensorFlow.js format
for use in the frontend emotion detection application.
"""

import os
import sys
import argparse
# from pathlib import Path

def convert_model(input_path, output_path):
    """
    Convert a TensorFlow/Keras model to TensorFlow.js format.
    
    Args:
        input_path (str): Path to the input .h5 model file
        output_path (str): Path to the output directory for TensorFlow.js files
    """
    try:
        import tensorflowjs as tfjs
        
        print(f"Converting model from {input_path} to {output_path}")
        
        # Create output directory if it doesn't exist
        os.makedirs(output_path, exist_ok=True)
        
        # Convert the model
        tfjs.converters.save_keras_model(
            model_path=input_path,
            artifacts_dir=output_path
        )
        
        print(f"✅ Model converted successfully!")
        print(f"📁 Output files:")
        
        # List the generated files
        for file in os.listdir(output_path):
            file_path = os.path.join(output_path, file)
            if os.path.isfile(file_path):
                size = os.path.getsize(file_path)
                print(f"   - {file} ({size:,} bytes)")
                
    except ImportError:
        print("❌ tensorflowjs not found. Install it with:")
        print("   pip install tensorflowjs")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        sys.exit(1)

def create_demo_model():
    """
    Create a simple demo emotion detection model for testing.
    """
    try:
        import tensorflow as tf
        from tensorflow import keras
        
        print("Creating demo emotion detection model...")
        
        # Create a simple CNN model for emotion detection
        model = keras.Sequential([
            keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Conv2D(64, (3, 3), activation='relu'),
            keras.layers.Flatten(),
            keras.layers.Dense(64, activation='relu'),
            keras.layers.Dense(7, activation='softmax')  # 7 emotions
        ])
        
        model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Save the model
        model_path = "demo_emotion_model.h5"
        model.save(model_path)
        
        print(f"✅ Demo model created: {model_path}")
        return model_path
        
    except ImportError:
        print("❌ TensorFlow not found. Install it with:")
        print("   pip install tensorflow")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error creating demo model: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Convert TensorFlow models to TensorFlow.js format')
    parser.add_argument('--input', '-i', help='Input .h5 model file path')
    parser.add_argument('--output', '-o', default='public/models', help='Output directory path')
    parser.add_argument('--demo', action='store_true', help='Create and convert a demo model')
    
    args = parser.parse_args()
    
    if args.demo:
        print("🎭 Creating demo emotion detection model...")
        model_path = create_demo_model()
        convert_model(model_path, args.output)
        
        # Clean up demo model
        if os.path.exists(model_path):
            os.remove(model_path)
            print(f"🧹 Cleaned up {model_path}")
            
    elif args.input:
        if not os.path.exists(args.input):
            print(f"❌ Input file not found: {args.input}")
            sys.exit(1)
        convert_model(args.input, args.output)
        
    else:
        print("❌ Please provide either --input or --demo")
        print("\nUsage examples:")
        print("  python convert-model.py --demo")
        print("  python convert-model.py --input model.h5 --output public/models")
        sys.exit(1)

if __name__ == "__main__":
    main() 