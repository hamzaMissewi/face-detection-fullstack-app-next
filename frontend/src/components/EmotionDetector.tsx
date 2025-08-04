'use client'

import { useRef, useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'

export default function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [emotion, setEmotion] = useState<{ emotion: string; confidence: number } | null>(null)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [detectionCount, setDetectionCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [faceDetectionModel, setFaceDetectionModel] = useState<tf.LayersModel | null>(null)

  const emotionLabels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Set backend to WebGL for better performance
        await tf.setBackend('webgl')
        console.log('TensorFlow.js backend set to:', tf.getBackend())
        
        // Initialize TensorFlow.js
        await tf.ready()
        console.log('TensorFlow.js initialized')
        
        // Load emotion detection model
        try {
          const emotionModel = await tf.loadLayersModel('/models/emotion_model.json')
          setModel(emotionModel)
          console.log('Emotion model loaded successfully')
        } catch (modelError) {
          console.warn('Could not load emotion model, using simulation:', modelError)
          // Continue with simulation if model not found
        }
        
        // Load face detection model (if available)
        try {
          const faceModel = await tf.loadLayersModel('/models/face_detection_model.json')
          setFaceDetectionModel(faceModel)
          console.log('Face detection model loaded successfully')
        } catch (faceModelError) {
          console.warn('Could not load face detection model, using fallback:', faceModelError)
          // Continue with skin color detection
        }
        
        setIsModelLoaded(true)
        startVideo()
      } catch (error) {
        console.error('Error loading models:', error)
        setError('Failed to load TensorFlow.js models')
        setIsModelLoaded(true)
      startVideo()
      }
    }

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user'
          } 
        })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error('Camera error:', err)
          setError('Failed to access camera. Please check permissions.')
        })
    }

    loadModels()
  }, [])

  const preprocessImage = (imageData: ImageData): tf.Tensor => {
    // Convert to grayscale and resize to 48x48 for emotion detection
    const tensor = tf.browser.fromPixels(imageData, 1) // 1 channel for grayscale
    const resized = tf.image.resizeBilinear(tensor, [48, 48])
    const normalized = resized.div(255.0)
    const batched = normalized.expandDims(0) // Add batch dimension
    
    // Clean up intermediate tensors
    tensor.dispose()
    resized.dispose()
    normalized.dispose()
    
    return batched
  }

  const detectFaceWithModel = async (imageData: ImageData): Promise<boolean> => {
    if (!faceDetectionModel) {
      return detectFaceWithSkinColor(imageData)
    }

    try {
      // Preprocess image for face detection model
      const tensor = tf.browser.fromPixels(imageData, 3) // RGB
      const resized = tf.image.resizeBilinear(tensor, [224, 224]) // Common input size
      const normalized = resized.div(255.0)
      const batched = normalized.expandDims(0)
      
      // Predict face detection
      const prediction = await faceDetectionModel.predict(batched) as tf.Tensor
      const hasFace = prediction.dataSync()[0] > 0.5
      
      // Clean up
      tensor.dispose()
      resized.dispose()
      normalized.dispose()
      batched.dispose()
      prediction.dispose()
      
      return hasFace
    } catch (error) {
      console.warn('Face detection model failed, falling back to skin color detection:', error)
      return detectFaceWithSkinColor(imageData)
    }
  }

  const detectFaceWithSkinColor = (imageData: ImageData): boolean => {
    // Simple face detection using skin color detection
    const data = imageData.data
    let skinPixels = 0
    let totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Enhanced skin color detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b &&
          r > 60 && g > 40 && b > 20) {
        skinPixels++
      }
    }

    const skinRatio = skinPixels / totalPixels
    return skinRatio > 0.08 // Lower threshold for better detection
  }

  const predictEmotion = async (inputTensor: tf.Tensor): Promise<{ emotion: string; confidence: number }> => {
    if (!model) {
      // Fallback to simulation if model not loaded
      return simulateEmotionDetection()
    }

    try {
      const predictions = await model.predict(inputTensor) as tf.Tensor
      const predictionData = predictions.dataSync()
      const emotionIndex = predictionData.indexOf(Math.max(...predictionData))
      const confidence = predictionData[emotionIndex]
      
      // Clean up
      predictions.dispose()
      
      return {
        emotion: emotionLabels[emotionIndex],
        confidence: confidence
      }
    } catch (error) {
      console.warn('Emotion prediction failed, using simulation:', error)
      return simulateEmotionDetection()
    }
  }

  const detectEmotion = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded || isDetecting) return

    setIsDetecting(true)
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      // Draw video frame to canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)

      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Detect if there's a face in the image
      const hasFace = await detectFaceWithModel(imageData)
      setFaceDetected(hasFace)
      
      if (hasFace) {
        // Preprocess the image for emotion detection
        const inputTensor = preprocessImage(imageData)
        
        // Predict emotion
        const prediction = await predictEmotion(inputTensor)
        setEmotion(prediction)
        setDetectionCount(prev => prev + 1)
        
        // Clean up
        inputTensor.dispose()
      } else {
        setEmotion(null)
      }
      
    } catch (error) {
      console.error('Error detecting emotion:', error)
    } finally {
      setIsDetecting(false)
    }
  }

  const simulateEmotionDetection = () => {
    // Simulate emotion detection for demo purposes
    const emotions = emotionLabels
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const confidence = Math.random() * 0.3 + 0.7 // Random confidence between 0.7 and 1.0
    
    return {
      emotion: randomEmotion,
      confidence: confidence
    }
  }

  const handleVideoOnPlay = () => {
    // Start emotion detection loop
    const detectionInterval = setInterval(() => {
      if (videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA) {
        detectEmotion()
      }
    }, 500) // Detect every 500ms

    // Cleanup interval on component unmount
    return () => clearInterval(detectionInterval)
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Feed */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Live Video Feed</h3>
          <div className="video-container">
      <video
        ref={videoRef}
        onPlay={handleVideoOnPlay}
        autoPlay
        muted
              playsInline
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        
        {/* Detection Results */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Detection Results</h3>
          <div className="detection-panel">
            {!isModelLoaded ? (
              <div className="text-center py-8">
                <div className="loading-animation">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
                <p className="mt-4 text-gray-600">Loading TensorFlow.js models...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Face Detection Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Face Detection:</span>
                  <span className={`face-status ${faceDetected ? 'face-detected' : 'face-not-detected'}`}>
                    {faceDetected ? '👤 Face Detected' : '❌ No Face Detected'}
                  </span>
                </div>
                
                {/* Model Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Emotion Model:</span>
                  <span className={`face-status ${model ? 'face-detected' : 'face-not-detected'}`}>
                    {model ? '✅ Loaded' : '⚠️ Using Simulation'}
                  </span>
                </div>
                
                {/* Emotion Display */}
                {emotion && faceDetected ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Emotion</h4>
                      <div className="emotion-display">{emotion.emotion}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium">{(emotion.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${emotion.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      {faceDetected ? 'Analyzing emotions...' : 'Please position your face in the camera'}
                    </p>
                  </div>
                )}
                
                {/* Stats */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Detections:</span>
                    <span className="font-medium">{detectionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Backend:</span>
                    <span className="font-medium">{tf.getBackend()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Implementation Notes */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-yellow-800 mb-3">📝 Implementation Notes</h4>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• {model ? 'Emotion model loaded successfully' : 'Using simulated emotion detection. For production, convert your .h5 model to TensorFlow.js format.'}</li>
          <li>• {faceDetectionModel ? 'Face detection model loaded' : 'Face detection uses enhanced skin color detection. For better accuracy, use a proper face detection model.'}</li>
          <li>• To use your actual models, place the converted model files in <code className="bg-yellow-100 px-1 rounded">/public/models/</code>.</li>
          <li>• Use <code className="bg-yellow-100 px-1 rounded">tensorflowjs_converter</code> to convert your Python models to TensorFlow.js format.</li>
        </ul>
      </div>
    </div>
  )
}