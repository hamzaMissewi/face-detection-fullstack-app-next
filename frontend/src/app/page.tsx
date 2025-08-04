'use client'
import dynamic from 'next/dynamic'

// Dynamically import the EmotionDetector component to avoid SSR issues with TensorFlow.js
const EmotionDetector = dynamic(() => import('@/components/EmotionDetector'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading TensorFlow.js...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TensorFlow.js Emotion Detector
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time emotion detection using TensorFlow.js and your webcam. 
            This application uses machine learning to analyze facial expressions 
            and detect emotions in real-time.
          </p>
        </div>
        
        <EmotionDetector />
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, TensorFlow.js, and React
          </p>
        </div>
      </div>
    </main>
  )
} 
