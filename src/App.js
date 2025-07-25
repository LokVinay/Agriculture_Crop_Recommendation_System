import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState("");
  const [isLocationAuto, setIsLocationAuto] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchWeather = async () => {
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      let weatherUrl = "";

      if (isLocationAuto) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
              const response = await axios.get(weatherUrl);
              handleWeatherData(response.data);
            },
            () => setError("Unable to fetch location.")
          );
        } else {
          setError("Geolocation not supported.");
        }
      } else {
        if (!location) return setError("Please enter a city name.");
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        const response = await axios.get(weatherUrl);
        handleWeatherData(response.data);
      }
    } catch {
      setError("Failed to fetch weather data.");
    }
  };

  const handleWeatherData = (data) => {
    setWeatherData(data);
    setFormData((prev) => ({
      ...prev,
      temperature: data.main.temp.toFixed(1),
      humidity: data.main.humidity,
      rainfall: (Math.random() * 100).toFixed(1), // Placeholder
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(formData).toString();
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommend?${queryParams}`, {
        method: "POST",
      });
      const data = await response.json();
      setResult(data.recommended_crop);
    } catch {
      setResult("Error: Unable to fetch recommendation.");
    }
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="title">Agribot Crop Recommendation</h1>
      </header>

      <main className="main">
        <div className="left-panel">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>N (Nitrogen):</label>
              <input type="number" name="N" value={formData.N} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>P (Phosphorus):</label>
              <input type="number" name="P" value={formData.P} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>K (Potassium):</label>
              <input type="number" name="K" value={formData.K} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Temperature (°C):</label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Humidity (%):</label>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>pH:</label>
              <input type="number" name="ph" value={formData.ph} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Rainfall (mm):</label>
              <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
            </div>

            <div className="form-group location-buttons">
              <button
                type="button"
                className="location-toggle"
                onClick={() => setIsLocationAuto(!isLocationAuto)}
              >
                {isLocationAuto ? "Switch to Manual Location" : "Switch to Auto Location"}
              </button>
              {!isLocationAuto && (
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city"
                />
              )}
              <button type="button" className="fetch-button" onClick={fetchWeather}>
                Fetch Weather
              </button>
            </div>

            <button type="submit" className="submit-button">Get Recommendation</button>
          </form>

          {result && (
            <div className="result">
              <h2>Recommended Crop: 🌱 {result}</h2>
            </div>
          )}
        </div>

        {weatherData && !error && (
          <div className="weather-box">
            <h3>🌤 Weather Info</h3>
            <p><strong>City:</strong> {weatherData.name}</p>
            <p><strong>Temp:</strong> {weatherData.main.temp}°C</p>
            <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
            <p><strong>Condition:</strong> {weatherData.weather[0].description}</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Agribot | All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
