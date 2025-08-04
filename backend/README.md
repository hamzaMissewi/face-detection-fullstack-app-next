# TensorFlow Emotion Detection Backend

This Python backend provides TensorFlow-based emotion detection with FastAPI integration.

## Setup Instructions

### 1. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Run the Backend Server

```bash
# Start the FastAPI server
python app/main.py
```

The server will run on `http://localhost:8000`

### 3. API Endpoints

- **POST** `/predict_emotion/` - Upload an image for emotion detection
- **GET** `/docs` - Interactive API documentation (Swagger UI)

## Project Structure

```
backend/
├── app/
│   └── main.py              # FastAPI server with emotion detection
├── tensorflow/
│   └── tensor.py            # TensorFlow model training and utilities
├── models/                  # Saved model files
├── requirements.txt         # Python dependencies
└── README.md              # This file
```

## Usage Examples

### 1. Train a Model

```python
# Run the TensorFlow training script
python tensorflow/tensor.py
```

This will:
- Load and preprocess data
- Train a CNN model
- Save the model as `emotion_model.h5`

### 2. Convert Model to TensorFlow.js

```bash
# Convert .h5 model to TensorFlow.js format
tensorflowjs_converter --input_format keras \
    models/emotion_model.h5 \
    ../frontend/public/models/
```

### 3. Test the API

```bash
# Test emotion detection endpoint
curl -X POST "http://localhost:8000/predict_emotion/" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/image.jpg"
```

## Model Architecture

The emotion detection model uses:
- **Input**: 48x48 grayscale images
- **Architecture**: CNN with Conv2D, MaxPooling2D, Dense layers
- **Output**: 7 emotion classes (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- **Optimization**: Adam optimizer with categorical crossentropy loss

## Integration with Frontend

1. **Model Conversion**: Convert trained models to TensorFlow.js format
2. **API Integration**: Frontend can call backend API for server-side processing
3. **Real-time Detection**: Use converted models for client-side inference

## Development Workflow

1. **Train Model**: Use `tensorflow/tensor.py` to train emotion detection model
2. **Convert Model**: Use `tensorflowjs_converter` to convert for frontend use
3. **Test API**: Use FastAPI endpoints for server-side processing
4. **Deploy**: Run both frontend and backend servers

## Troubleshooting

### Common Issues

1. **TensorFlow Installation**: Ensure you have Python 3.8+ and pip installed
2. **Model Loading**: Check that model files are in the correct directory
3. **API Errors**: Verify FastAPI server is running on correct port
4. **Memory Issues**: Reduce batch size or model complexity if needed

### Performance Tips

- Use GPU acceleration if available
- Optimize model architecture for your use case
- Consider model quantization for deployment
- Use caching for repeated predictions

## Next Steps

1. Replace MNIST data with actual emotion dataset
2. Implement face detection preprocessing
3. Add model validation and testing
4. Optimize for production deployment 