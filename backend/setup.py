#!/usr/bin/env python3
"""
Setup script for TensorFlow Emotion Detection Backend
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False
    return True

def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    directories = ["models", "data", "logs"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"   Created: {directory}/")
    print("✅ Directories created!")

def test_tensorflow():
    """Test TensorFlow installation"""
    print("🧪 Testing TensorFlow installation...")
    try:
        import tensorflow as tf
        print(f"✅ TensorFlow {tf.__version__} installed successfully!")
        print(f"   Backend: {tf.config.list_physical_devices()}")
        return True
    except ImportError as e:
        print(f"❌ TensorFlow not found: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up TensorFlow Emotion Detection Backend")
    print("=" * 50)
    
    # Install dependencies
    if not install_requirements():
        print("❌ Setup failed during dependency installation")
        return
    
    # Create directories
    create_directories()
    
    # Test TensorFlow
    if not test_tensorflow():
        print("❌ Setup failed during TensorFlow test")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Run 'python tensorflow/tensor.py' to train a model")
    print("2. Run 'python app/main.py' to start the FastAPI server")
    print("3. Visit http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main() 