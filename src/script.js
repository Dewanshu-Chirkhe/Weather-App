import "./style.css";

const locationInput = document.querySelector(".location-input");
const unitButtons = document.querySelector(".unit-btn");
const tempElem = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-description");
const minElem = document.querySelector("min");
const maxElem = document.querySelector("max");
const weatherIcon = document.querySelector("weather-status-icon");

const API_KEY = process.env.API_KEY;
let currentUnit = "celsius";

locationInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const location = locationInput.value.trim();
        if (location) fetchWeather(location);
    }
});

unitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        unitButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentUnit = btn.dataset.unit === "c" ? "celsius" : "farenheit";

        if (locationInput.value.trim()) {
            fetchWeather(locationInput.value.trim());
        }
    });
});

async function fetchWeather(location) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Location not found");

        const data = await res.json();
        updateWeatherUI(data);
    } catch (error) {
        console.log(error);
        alert("Could not fetch weather. Please try again.");
    }
}

function updateWeatherUI(data) {}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".location-input").value = "Nagpur";
    fetchWeather("Nagpur");
});
