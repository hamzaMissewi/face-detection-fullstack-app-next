import React, { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'
// Téléchargez les modèles (tiny_face_detector, face_expression_model) depuis le repo face-api.js et placez-les dans /public/models.


export default function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // const [expressions, setExpressions] = useState<faceapi.FaceExpressions|null>(null)
  const [expressions, setExpressions] = useState<{ expression: string; value: number; }|null>(null)

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models' // placez vos modèles sous /public/models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      startVideo()
    }

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => {
if(   videoRef.current){
  videoRef.current.srcObject = stream
}
        })
        .catch((err) => console.error('Erreur caméra:', err))
    }

    loadModels()
  }, [])

  const handleVideoOnPlay = async () => {
    const options = new faceapi.TinyFaceDetectorOptions()
    setInterval(async () => {
      if(!videoRef.current) return
      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceExpressions()
      if (detections.length > 0) {
        // On prend la 1ʳᵉ personne détectée
        const firstExpression=detections[0].expressions.asSortedArray().sort((a, b) => b.probability - a.probability)[0]

        setExpressions({...firstExpression,value:firstExpression.probability})

        
      }
    }, 200)
  }

  return (
    <div>
      <video
        ref={videoRef}
        onPlay={handleVideoOnPlay}
        autoPlay
        muted
        width="480"
        height="360"
      />
      <div>
        {expressions
          ? `Expression dominante : ${expressions.expression} (${(expressions.value * 100).toFixed(1)}%)`
          : 'Chargement…'}
      </div>
    </div>
  )
}