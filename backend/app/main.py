# app/main.py
from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
import cv2
from tensorflow.keras.models import load_model

app = FastAPI()
# Chargez votre modèle d’émotions (ex. entraîné sur FER2013)
model = load_model("models/emotion_model.h5")
emotion_labels = ["Angry","Disgust","Fear","Happy","Sad","Surprise","Neutral"]

@app.post("/predict_emotion/")
async def predict_emotion(file: UploadFile = File(...)):
    image_data = await file.read()
    # Conversion en image OpenCV
    np_arr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_GRAYSCALE)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(img, 1.1, 4)
    if len(faces) == 0:
        return {"error": "No face detected"}
    x, y, w, h = faces[0]
    face = img[y:y+h, x:x+w]
    face = cv2.resize(face, (48, 48))  # taille attendue par le modèle
    face = face.astype("float32") / 255.0
    face = np.expand_dims(face, axis=[0, -1])  # shape (1,48,48,1)
    preds = model.predict(face)[0]
    top_idx = np.argmax(preds)
    return {"emotion": emotion_labels[top_idx], "confidence": float(preds[top_idx])}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
