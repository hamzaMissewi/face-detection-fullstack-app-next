# TensorFlow.js Emotion Detection Frontend

This React application uses TensorFlow.js for real-time emotion detection from webcam video feed.

## Features

- Real-time face detection using TensorFlow.js
- Emotion recognition (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
- Modern, responsive UI with live video feed
- WebGL acceleration for better performance
- Face detection status indicator
- Confidence scoring for detected emotions

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Convert Your Python Model to TensorFlow.js

If you have a trained emotion detection model in `.h5` format, convert it to TensorFlow.js format:

```bash
# Install tensorflowjs_converter
pip install tensorflowjs

# Convert your model
tensorflowjs_converter --input_format keras \
    /path/to/your/emotion_model.h5 \
    public/models/
```

### 3. Model Structure

Place your converted model files in `public/models/`:
```
public/models/
├── emotion_model.json
└── emotion_model.weights.bin
```

### 4. Update Model Loading

In `src/components/EmotionDetector.tsx`, uncomment the model loading code:

```typescript
// Replace the mock model with your actual model
const model = await tf.loadLayersModel('/models/emotion_model.json')
```

### 5. Run the Application

```bash
npm run dev
```

## Implementation Details

### Face Detection
- Currently uses simple skin color detection
- For production, consider using a proper face detection model like:
  - BlazeFace
  - MediaPipe Face Detection
  - TensorFlow.js Face Detection

### Emotion Detection
- Processes video frames at 48x48 grayscale
- Normalizes pixel values (0-1 range)
- Supports 7 emotion classes
- Returns confidence scores for predictions

### Performance Optimizations
- WebGL backend for GPU acceleration
- Tensor cleanup to prevent memory leaks
- Efficient image preprocessing pipeline
- 500ms detection interval for real-time performance

## Customization

### Adding New Emotions
Update the `emotionLabels` array in `EmotionDetector.tsx`:

```typescript
const emotionLabels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral", "YourNewEmotion"]
```

### Adjusting Detection Sensitivity
Modify the face detection threshold in `detectFace()`:

```typescript
const skinRatio = skinPixels / totalPixels
return skinRatio > 0.1 // Adjust this threshold
```

### Changing Detection Frequency
Update the interval in `handleVideoOnPlay()`:

```typescript
setInterval(() => {
  // detection logic
}, 500) // Adjust milliseconds
```

## Troubleshooting

### Model Loading Issues
- Ensure model files are in `public/models/`
- Check browser console for loading errors
- Verify model format compatibility

### Camera Access Issues
- Ensure HTTPS for production (required for camera access)
- Check browser permissions for camera access
- Try different browsers if issues persist

### Performance Issues
- Check if WebGL backend is active
- Reduce detection frequency if needed
- Monitor memory usage in browser dev tools

## Backend Integration

This frontend can work with the Python FastAPI backend for server-side processing:

1. Send video frames to backend endpoint
2. Process on server with more powerful models
3. Return results to frontend for display

## Dependencies

- `@tensorflow/tfjs`: Core TensorFlow.js library
- `@tensorflow/tfjs-backend-webgl`: WebGL backend for GPU acceleration
- `react`: UI framework
- `typescript`: Type safety

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Note: WebGL support required for optimal performance.
