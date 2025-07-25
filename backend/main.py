from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

# Initialize FastAPI app
app = FastAPI()

# Load the trained model
with open("crop_recommendation_model.pkl", "rb") as file:
    model = pickle.load(file)

# Define request body model
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.post("/recommend")
def recommend_crop(data: CropInput):
    try:
        # Convert input data to a NumPy array (reshape to 2D)
        input_data = np.array([[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]])
        
        # Ensure input matches expected feature order
        feature_names = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        
        # Make prediction
        prediction = model.predict(input_data)[0]

        return {"recommended_crop": prediction}

    except Exception as e:
        return {"error": str(e)}
