# Python & TensorFlow Usage Guide

This guide explains how to use Python files with TensorFlow in your emotion detection project.

## 🚀 Quick Start

### 1. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Test TensorFlow Installation

```bash
# Run the setup script
python setup.py
```

### 3. Run Basic Example

```bash
# Run the basic TensorFlow example
python examples/basic_tensorflow.py
```

## 📁 Project Structure

```
backend/
├── app/
│   └── main.py              # FastAPI server
├── tensorflow/
│   └── tensor.py            # Model training script
├── examples/
│   └── basic_tensorflow.py  # Basic TensorFlow example
├── models/                  # Saved models
├── requirements.txt         # Python dependencies
├── setup.py                # Setup script
└── README.md              # Backend documentation
```

## 🧠 TensorFlow Usage Examples

### 1. Basic Model Creation

```python
import tensorflow as tf
from tensorflow import keras

# Create a simple CNN
model = keras.Sequential([
    keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.Flatten(),
    keras.layers.Dense(7, activation='softmax')  # 7 emotions
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')
```

### 2. Training a Model

```python
# Load and preprocess data
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
x_train = tf.image.resize(x_train[..., tf.newaxis], (48, 48)) / 255.0

# Create datasets
train_dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train)).batch(32)

# Train the model
model.fit(train_dataset, epochs=5)
```

### 3. Making Predictions

```python
import numpy as np
import cv2

def predict_emotion(image_path):
    # Load and preprocess image
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (48, 48))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=[0, -1])
    
    # Make prediction
    prediction = model.predict(img)
    emotion_index = np.argmax(prediction[0])
    
    emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    return emotions[emotion_index]
```

## 🔧 Common Operations

### 1. Save and Load Models

```python
# Save model
model.save('models/emotion_model.h5')

# Load model
loaded_model = tf.keras.models.load_model('models/emotion_model.h5')
```

### 2. Convert to TensorFlow.js

```bash
# Install tensorflowjs
pip install tensorflowjs

# Convert model
tensorflowjs_converter --input_format keras \
    models/emotion_model.h5 \
    ../frontend/public/models/
```

### 3. Use with FastAPI

```python
from fastapi import FastAPI, File, UploadFile
import tensorflow as tf

app = FastAPI()
model = tf.keras.models.load_model("models/emotion_model.h5")

@app.post("/predict_emotion/")
async def predict_emotion(file: UploadFile = File(...)):
    # Process uploaded image
    image_data = await file.read()
    # ... preprocessing ...
    prediction = model.predict(processed_image)
    return {"emotion": predicted_emotion}
```

## 🎯 Key Files Explained

### 1. `tensorflow/tensor.py`
- **Purpose**: Train emotion detection models
- **Usage**: `python tensorflow/tensor.py`
- **Output**: Saves trained model as `.h5` file

### 2. `app/main.py`
- **Purpose**: FastAPI server for emotion detection API
- **Usage**: `python app/main.py`
- **Access**: http://localhost:8000/docs

### 3. `examples/basic_tensorflow.py`
- **Purpose**: Basic TensorFlow usage examples
- **Usage**: `python examples/basic_tensorflow.py`
- **Learning**: Good starting point for understanding TensorFlow

## 🔄 Workflow

### Development Workflow

1. **Setup Environment**
   ```bash
   cd backend
   python setup.py
   ```

2. **Train Model**
   ```bash
   python tensorflow/tensor.py
   ```

3. **Test API**
   ```bash
   python app/main.py
   # Visit http://localhost:8000/docs
   ```

4. **Convert for Frontend**
   ```bash
   tensorflowjs_converter --input_format keras \
       models/emotion_model.h5 \
       ../frontend/public/models/
   ```

### Production Workflow

1. **Train with Real Data**
   - Replace MNIST with emotion dataset
   - Optimize model architecture
   - Validate model performance

2. **Deploy Backend**
   - Run FastAPI server
   - Configure for production
   - Add authentication/rate limiting

3. **Deploy Frontend**
   - Convert model to TensorFlow.js
   - Deploy React app
   - Configure API endpoints

## 🛠️ Troubleshooting

### Common Issues

1. **TensorFlow Not Found**
   ```bash
   pip install tensorflow
   ```

2. **Model Loading Errors**
   - Check file paths
   - Verify model format
   - Ensure dependencies are installed

3. **Memory Issues**
   - Reduce batch size
   - Use smaller model architecture
   - Enable GPU if available

4. **API Errors**
   - Check server is running
   - Verify endpoint URLs
   - Check request format

### Performance Tips

- **GPU Acceleration**: Install CUDA for GPU support
- **Model Optimization**: Use model quantization
- **Batch Processing**: Process multiple images at once
- **Caching**: Cache model predictions for repeated inputs

## 📚 Learning Resources

- [TensorFlow Documentation](https://www.tensorflow.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenCV Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)

## 🎉 Next Steps

1. **Replace Demo Data**: Use real emotion datasets
2. **Improve Model**: Experiment with different architectures
3. **Add Features**: Face detection, real-time processing
4. **Optimize**: Performance tuning and deployment 