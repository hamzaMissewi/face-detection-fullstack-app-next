# Complete Setup Guide: TensorFlow.js Emotion Detection

This guide will help you complete the emotion detection system with proper model conversion and deployment.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 2. Create and Convert Models

```bash
# Create demo models and convert to TensorFlow.js
cd frontend/scripts
python convert-models.py --demo
```

### 3. Run the Application

```bash
# Start the frontend
cd frontend
npm run dev

# Start the backend (in another terminal)
cd backend
python app/main.py
```

Visit: **http://localhost:3000**

## 📋 Complete Setup Steps

### Step 1: Backend Setup

#### 1.1 Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 1.2 Train Models (Optional)
```bash
# Train emotion detection model
python tensorflow/tensor.py

# This will create:
# - models/emotion_model.h5
# - models/face_detection_model.h5 (if implemented)
```

#### 1.3 Test Backend API
```bash
python app/main.py
# Visit http://localhost:8000/docs for API documentation
```

### Step 2: Model Conversion

#### 2.1 Convert Existing Models
```bash
cd frontend/scripts

# Convert emotion model
python convert-models.py --emotion-model ../../backend/models/emotion_model.h5

# Convert face detection model (if available)
python convert-models.py --face-model ../../backend/models/face_detection_model.h5

# Or convert all models at once
python convert-models.py --all
```

#### 2.2 Create Demo Models (If no trained models)
```bash
cd frontend/scripts
python convert-models.py --demo
```

This will create:
- `public/models/emotion_model.json`
- `public/models/emotion_model.weights.bin`
- `public/models/face_detection_model.json`
- `public/models/face_detection_model.weights.bin`
- `public/models/model_info.json`

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Verify Model Files
Ensure these files exist in `public/models/`:
```
public/models/
├── emotion_model.json
├── emotion_model.weights.bin
├── face_detection_model.json
├── face_detection_model.weights.bin
└── model_info.json
```

#### 3.3 Run Development Server
```bash
npm run dev
```

## 🔧 Model Conversion Details

### Emotion Detection Model

**Input Format:**
- Shape: `(1, 48, 48, 1)` - Grayscale image
- Normalization: `[0, 1]` range
- Preprocessing: Resize to 48x48, convert to grayscale

**Output Format:**
- 7 emotion classes: `["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]`
- Softmax activation for probability distribution

### Face Detection Model

**Input Format:**
- Shape: `(1, 224, 224, 3)` - RGB image
- Normalization: `[0, 1]` range
- Preprocessing: Resize to 224x224

**Output Format:**
- Binary classification: `[0, 1]` (No Face, Face Detected)
- Sigmoid activation for probability

## 🎯 Advanced Configuration

### Custom Model Conversion

If you have your own trained models:

```bash
# Convert custom emotion model
python convert-models.py --emotion-model /path/to/your/emotion_model.h5

# Convert custom face detection model
python convert-models.py --face-model /path/to/your/face_model.h5
```

### Model Architecture Requirements

#### Emotion Detection Model
```python
# Expected input shape: (48, 48, 1)
# Expected output shape: (7,) - 7 emotions
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(7, activation='softmax')
])
```

#### Face Detection Model
```python
# Expected input shape: (224, 224, 3)
# Expected output shape: (1,) - binary classification
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

## 🚀 Production Deployment

### Frontend Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

#### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Backend Deployment

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway login
railway up
```

#### Docker
```bash
# Build and run with Docker
docker-compose up --build
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Model Loading Errors
```bash
# Check model files exist
ls -la frontend/public/models/

# Verify model format
python -c "import tensorflowjs as tfjs; tfjs.converters.load_keras_model('frontend/public/models/emotion_model.json')"
```

#### 2. Camera Access Issues
- Ensure HTTPS in production
- Check browser permissions
- Try different browsers

#### 3. TensorFlow.js Errors
```bash
# Clear browser cache
# Check WebGL support
# Verify TensorFlow.js version compatibility
```

#### 4. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Performance Optimization

#### 1. Model Optimization
```bash
# Quantize models for smaller size
tensorflowjs_converter --input_format keras \
    --output_format tfjs_graph_model \
    --quantize_uint8 \
    model.h5 \
    public/models/
```

#### 2. Bundle Optimization
```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tensorflow/tfjs']
  }
}
```

## 📊 Testing

### Manual Testing
1. Open http://localhost:3000
2. Allow camera access
3. Position face in camera
4. Verify emotion detection
5. Check face detection status

### Automated Testing
```bash
# Run frontend tests
npm test

# Run backend tests
cd backend
python -m pytest tests/
```

## 🔄 Development Workflow

### 1. Model Development
```bash
# Train models in Python
cd backend
python tensorflow/tensor.py

# Convert to TensorFlow.js
cd ../frontend/scripts
python convert-models.py --all
```

### 2. Frontend Development
```bash
# Start development server
cd frontend
npm run dev

# Make changes and see live updates
```

### 3. Testing
```bash
# Test both frontend and backend
# Verify model loading
# Check camera functionality
# Test emotion detection accuracy
```

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [Next.js Documentation](https://nextjs.org/docs)
- [Model Conversion Guide](https://www.tensorflow.org/js/tutorials/conversion/import_keras)
- [WebGL Performance](https://www.tensorflow.org/js/guide/platform_environment)

## 🎉 Success Checklist

- [ ] Backend dependencies installed
- [ ] Models trained and converted
- [ ] Frontend dependencies installed
- [ ] Models loaded successfully
- [ ] Camera access working
- [ ] Face detection functional
- [ ] Emotion detection accurate
- [ ] Production build successful
- [ ] Deployment completed

---

**Your emotion detection system is now complete! 🎉**

The application includes:
- ✅ Real-time face detection
- ✅ Emotion classification
- ✅ TensorFlow.js integration
- ✅ Modern Next.js frontend
- ✅ FastAPI backend
- ✅ Production-ready deployment 