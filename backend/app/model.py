import tensorflow as tf
import numpy as np
import cv2

class Detector:
    def __init__(self, model_path: str = "saved_model"):
        self.model = tf.saved_model.load(model_path)

    def preprocess(self, img_bytes: bytes) -> tf.Tensor:
        # decode & resize
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        inp = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        inp = tf.convert_to_tensor(inp)
        inp = tf.image.resize(inp, [320, 320])
        return inp[tf.newaxis, ...]

    def detect(self, img_bytes: bytes):
        inp = self.preprocess(img_bytes)
        # run inference
        results = self.model(inp)
        # parse outputs (depends on model signature)
        boxes = results["detection_boxes"].numpy()[0]
        classes = results["detection_classes"].numpy()[0].astype(int)
        scores = results["detection_scores"].numpy()[0]
        return [{"box": boxes[i].tolist(),
                 "class": int(classes[i]),
                 "score": float(scores[i])}
                for i in range(len(scores)) if scores[i] > 0.5]
