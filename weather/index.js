const input = document.querySelector("input");
const btn = document.querySelector("#btn");
const icon = document.querySelector(".icon");
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");
const feelsLike = document.querySelector(".feels-like");
const dateTime = document.querySelector(".date-time");
const weatherBox = document.querySelector(".weather-box");
const errorMessage = document.querySelector(".error-message");
const loadingSpinner = document.querySelector(".loading-spinner");

// API key is sensitive. In a real application, you'd handle this more securely (e.g., environment variables).
const API_KEY = '1f57860d16f50991ec43e06ab65ffb6e';

btn.addEventListener("click", () => {
    let city = input.value.trim(); // Trim whitespace
    if (city) {
        getWeather(city);
    } else {
        displayError("Please enter a city name.");
    }
});

// Allow searching on Enter key press
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    weatherBox.style.display = "none";
    loadingSpinner.style.display = "none";
}

function hideError() {
    errorMessage.style.display = "none";
}

function showLoading() {
    loadingSpinner.style.display = "block";
    weatherBox.style.display = "none";
    hideError();
}

function hideLoading() {
    loadingSpinner.style.display = "none";
    weatherBox.style.display = "block";
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    dateTime.textContent = now.toLocaleDateString('en-US', options);
}

// Initial call to set date and time
updateDateTime();
// Update every minute
setInterval(updateDateTime, 60000);


async function getWeather(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            } else {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log(data); // For debugging

        const iconCode = data.weather[0].icon;
        icon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon"/>`; // Use @2x for higher resolution

        const weatherCity = data.name;
        const weatherCountry = data.sys.country;
        weather.innerHTML = `${weatherCity}, ${weatherCountry}`;

        // Convert Kelvin to Celsius and fix to 2 decimal places
        const tempCelsius = (data.main.temp - 273.15).toFixed(1); // One decimal place is usually sufficient for temp
        temperature.innerHTML = `${tempCelsius}°C`;

        const weatherDesc = data.weather[0].description;
        description.innerHTML = capitalizeFirstLetter(weatherDesc); // Capitalize first letter of description

        const humidityValue = data.main.humidity;
        humidity.innerHTML = `Humidity: ${humidityValue}%`;

        const windSpeedValue = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
        windSpeed.innerHTML = `Wind: ${windSpeedValue} km/h`;

        const feelsLikeCelsius = (data.main.feels_like - 273.15).toFixed(1);
        feelsLike.innerHTML = `Feels like: ${feelsLikeCelsius}°C`;

        hideLoading();
        weatherBox.style.display = "block"; // Ensure weather box is visible
        hideError();

    } catch (error) {
        console.error("Error fetching weather data:", error);
        displayError(error.message || "Could not fetch weather data. Please try again later.");
        hideLoading(); // Hide loading spinner even on error
    }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Optional: Fetch weather for a default city on load
// getWeather("London");