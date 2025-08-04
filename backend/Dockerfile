FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
# copy your saved_model directory into image
COPY saved_model/ ./saved_model/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
