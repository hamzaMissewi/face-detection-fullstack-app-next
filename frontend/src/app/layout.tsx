import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TensorFlow.js Emotion Detector',
  description: 'Real-time emotion detection using TensorFlow.js and webcam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}

// This demo uses simulated emotion detection. For production, convert your .h5 model to TensorFlow.js format.
// • Face detection uses simple skin color detection. For better accuracy, use a proper face detection model.
// • To use your actual model, place the converted model files in /public/models/.
// • Use tensorflowjs_converter to convert your Python model to TensorFlow.js format.