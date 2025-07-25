from fastapi import FastAPI
import joblib
import numpy as np

# Load the trained model
model = joblib.load("crop_recommendation_model.pkl")

# Create FastAPI app
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message": "Welcome to Agribot Crop Recommendation API!"}

@app.post("/recommend")
def recommend_crop(N: int, P: int, K: int, temperature: float, humidity: float, ph: float, rainfall: float):
    # Create input array
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

    # Predict the crop
    predicted_crop = model.predict(input_data)[0]

    return {"recommended_crop": predicted_crop}
