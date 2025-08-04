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

  const emotionLabels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Set backend to WebGL for better performance
        await tf.setBackend('webgl')
        console.log('TensorFlow.js backend set to:', tf.getBackend())
        
        // Initialize TensorFlow.js
        await tf.ready()
        console.log('TensorFlow.js initialized')
        
        // For now, we'll use a mock model since we need to convert the .h5 model
        // In production, you would load the actual model:
        // const model = await tf.loadLayersModel('/models/emotion_model.json')
        
        setIsModelLoaded(true)
        startVideo()
      } catch (error) {
        console.error('Error loading model:', error)
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
        .catch((err) => console.error('Camera error:', err))
    }

    loadModel()
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

  const detectFace = (imageData: ImageData): boolean => {
    // Simple face detection using skin color detection
    // In production, you would use a proper face detection model
    const data = imageData.data
    let skinPixels = 0
    let totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Simple skin color detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        skinPixels++
      }
    }

    const skinRatio = skinPixels / totalPixels
    return skinRatio > 0.1 // If more than 10% of pixels are skin-colored
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
      const hasFace = detectFace(imageData)
      setFaceDetected(hasFace)
      
      if (hasFace) {
        // Preprocess the image for emotion detection
        const inputTensor = preprocessImage(imageData)
        
        // For demo purposes, we'll simulate emotion detection
        // In a real implementation, you would use the loaded model:
        // const predictions = await model.predict(inputTensor) as tf.Tensor
        // const emotionIndex = predictions.argMax(1).dataSync()[0]
        // const confidence = predictions.max().dataSync()[0]
        
        const mockPrediction = simulateEmotionDetection()
        setEmotion(mockPrediction)
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

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color:"white", backgroundColor: '#333', marginBottom: '30px' }}>
        TensorFlow.js Emotion Detector
      </h2>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div>
          <h4>Live Video Feed</h4>
          <video
            ref={videoRef}
            onPlay={handleVideoOnPlay}
            autoPlay
            muted
            width="480"
            height="360"
            style={{ 
              border: '3px solid #2196F3', 
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
        </div>
        
        <div style={{ minWidth: '300px' }}>
          <h4>Detection Results</h4>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '12px',
            border: '2px solid #e9ecef',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {!isModelLoaded ? (
              <div>
                <p>🔄 Loading TensorFlow.js model...</p>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#e9ecef',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: '60%', 
                      height: '100%', 
                      backgroundColor: '#2196F3',
                      animation: 'loading 1.5s ease-in-out infinite'
                    }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ 
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: faceDetected ? '#4CAF50' : '#f44336',
                    color: 'white'
                  }}>
                    {faceDetected ? '👤 Face Detected' : '❌ No Face Detected'}
                  </span>
                </div>
                
                {emotion && faceDetected ? (
                  <div>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      color: '#2196F3',
                      margin: '10px 0'
                    }}>
                      {emotion.emotion}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#666' }}>
                      Confidence: {(emotion.confidence * 100).toFixed(1)}%
                    </p>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#e9ecef',
                      borderRadius: '4px',
                      marginTop: '10px'
                    }}>
                      <div style={{ 
                        width: `${emotion.confidence * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#4CAF50',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontSize: '16px' }}>
                    {faceDetected ? 'Analyzing emotions...' : 'Please position your face in the camera'}
                  </p>
                )}
                
                <div style={{ 
                  marginTop: '20px', 
                  padding: '10px',
                  color: "black",
                  // backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}>
                  <p>Detections: {detectionCount}</p>
                  <p>Backend: {tf.getBackend()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        color: 'black'
      }}>
        <h4>📝 Implementation Notes</h4>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>This demo uses simulated emotion detection. For production, convert your .h5 model to TensorFlow.js format.</li>
          <li>Face detection uses simple skin color detection. For better accuracy, use a proper face detection model.</li>
          <li>To use your actual model, place the converted model files in <code>/public/models/</code>.</li>
          <li>Use <code>tensorflowjs_converter</code> to convert your Python model to TensorFlow.js format.</li>
        </ul>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}