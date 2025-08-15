import "./style.css";

const locationInput = document.querySelector(".location-input");
const unitButtons = document.querySelectorAll(".unit-btn");
const tempElem = document.getElementById("temperature");
const weatherDesc = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-status-icon");
const location = document.getElementById("name");
const region = document.getElementById("region");

const API_KEY = "c69c5005f3894a30a7f121423251208";
let currentUnit = "celsius";

locationInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const locValue = locationInput.value.trim();
        if (location) {
            fetchWeather(locValue);
            fetchForecast(locValue);
        }
    }
});

unitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        unitButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentUnit = btn.dataset.unit === "c" ? "celsius" : "fahrenheit";
        console.log(currentUnit);

        const locValue = locationInput.value.trim();
        if (locValue) {
            fetchWeather(locValue);
            fetchForecast(locValue);
        }
    });
});

async function fetchWeather(location) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Location not found");

        const data = await res.json();
        updateWeatherUI(data);
    } catch (error) {
        console.log(error);
        alert("Could not fetch weather. Please try again.");
    }
}

function updateWeatherUI(data) {
    const temp =
        currentUnit === "celsius" ? data.current.temp_c : data.current.temp_f;

    tempElem.innerText = `${parseInt(temp)}°`;

    const iconUrl = getIconUrl(data.current.condition.icon);
    weatherIcon.src = iconUrl;
    weatherDesc.innerText = data.current.condition.text;

    location.innerText = data.location.name;
    region.innerText = data.location.region;
}

async function fetchForecast(location) {
    const days = 4;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=${days}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error fetching data.");
        const data = await res.json();
        updateForecastUI(data);
        updateHourlyUI(data);
        updateWeeklyUI(data);
    } catch (error) {
        console.log(error);
    }
}

const rain = document.getElementById("rain-info");
const wind = document.getElementById("wind-info");
const sunrise = document.getElementById("sunrise-info");
const sunset = document.getElementById("sunset-info");
const uvindex = document.getElementById("uv-info");
const pressure = document.getElementById("pressure-info");
const humidity = document.getElementById("humidity-info");
const gust = document.getElementById("gust-info");

function updateForecastUI(data) {
    rain.innerText = `Chance of Rain :  ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    wind.innerText = `Wind : ${data.forecast.forecastday[0].day.maxwind_kph} kph`;
    sunrise.innerText = `Sunrise : ${data.forecast.forecastday[0].astro.sunrise}`;
    sunset.innerText = `Sunset : ${data.forecast.forecastday[0].astro.sunset}`;
    uvindex.innerText = `UV : ${data.current.uv}`;
    pressure.innerText = `Pressure : ${data.current.pressure_in} in`;
    humidity.innerText = `Humidity : ${data.current.humidity}`;
    gust.innerText = `Gust : ${data.current.gust_kph} kph`;
}

function updateHourlyUI(data) {
    const hourCards = document.querySelectorAll(".hourly-details .card");

    let currentTime = data.location.localtime;
    let currentHour = parseInt(currentTime.split(" ")[1].split(":")[0]);

    hourCards.forEach((card, index) => {
        card.innerHTML = "";
        const text = document.createElement("p");

        let totalHour = currentHour + index;
        let dayIndex = Math.floor(totalHour / 24);
        let hourIndex = totalHour % 24;

        let hourData = data.forecast.forecastday[dayIndex].hour[hourIndex];
        let displayHour = hourIndex % 12 || 12;

        let ampm = hourIndex < 12 ? "AM" : "PM";
        text.innerText = `${displayHour} ${ampm}`;

        const img = document.createElement("img");
        img.src = getIconUrl(hourData.condition.icon);

        card.appendChild(text);
        card.appendChild(img);
    });
}

function updateWeeklyUI(data) {
    const weeklyCards = document.querySelectorAll(".weekly-details .card");

    weeklyCards.forEach((card, index) => {
        if (data.forecast.forecastday[index]) {
            card.innerHTML = "";

            const img = document.createElement("img");
            img.src = getIconUrl(
                data.forecast.forecastday[index].day.condition.icon
            );

            const infoContainer = document.createElement("div");
            infoContainer.classList.add("info");

            const dateStr = data.forecast.forecastday[index].date;
            const dateObj = new Date(dateStr);
            const formattedDate = dateObj.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
            });
            const date = document.createElement("p");
            date.classList.add("date");
            date.innerText = formattedDate;

            const temperature = document.createElement("p");
            temperature.classList.add("temp");
            let unit = currentUnit === "celsius" ? "avgtemp_c" : "avgtemp_f";
            let temp = data.forecast.forecastday[index].day[unit];
            temperature.innerText = `${Math.round(temp)}°`;

            infoContainer.appendChild(date);
            infoContainer.appendChild(temperature);

            card.appendChild(img);
            card.appendChild(infoContainer);
        }
    });
}

function getIconUrl(icon) {
    const iconFolder = icon.match(/day|night/)[0];
    const numbers = icon.match(/\d+/g);
    const iconNumber = numbers[numbers.length - 1];
    return `assets/${iconFolder}/${iconNumber}.svg`;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("scipt loaded");
    locationInput.value = "Nagpur";
    fetchWeather("Nagpur");
    fetchForecast("Nagpur");
});