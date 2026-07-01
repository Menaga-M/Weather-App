var weatherApi = "/weather";
const weatherForm = document.querySelector(".weatherLocation");
const search = document.querySelector(".input-field");
const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");
const statusMessage = document.querySelector(".status-message");
const humidityValue = document.querySelector('[data-stat="humidity"]');
const windValue = document.querySelector('[data-stat="wind"]');
const feelsLikeValue = document.querySelector('[data-stat="feelsLike"]');
const submitButton = document.querySelector(".search-button");

const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = `${currentDate.getDate()} ${monthName} ${currentDate.getFullYear()}`;

function setLoadingState(message) {
  weatherIcon.className = "wi wi-refresh";
  weatherCondition.textContent = "Checking forecast";
  tempElement.textContent = "--";
  locationElement.textContent = "Searching your location...";
  statusMessage.textContent = message;
  humidityValue.textContent = "--";
  windValue.textContent = "--";
  feelsLikeValue.textContent = "--";
}

function setErrorState(message) {
  weatherIcon.className = "wi wi-alien";
  weatherCondition.textContent = "Unavailable";
  tempElement.textContent = "--";
  locationElement.textContent = "Weather unavailable";
  statusMessage.textContent = message;
  humidityValue.textContent = "--";
  windValue.textContent = "--";
  feelsLikeValue.textContent = "--";
}

function updateWeatherStats(result) {
  humidityValue.textContent = `${result.main.humidity}%`;
  windValue.textContent = `${Math.round(result.wind.speed)} m/s`;
  feelsLikeValue.textContent = `${Math.round(result.main.feels_like - 273.15)}°C`;
}

function showData(city) {
  setLoadingState(`Fetching weather for ${city || "your city"}...`);

  getWeatherData(city, (response) => {
    if (!response || !response.success) {
      setErrorState(response?.message || "Unable to retrieve weather data.");
      return;
    }

    const result = response;
    const iconMap = {
      Clear: "wi wi-day-sunny",
      Clouds: "wi wi-day-cloudy",
      Rain: "wi wi-rain",
      Drizzle: "wi wi-showers",
      Thunderstorm: "wi wi-thunderstorm",
      Snow: "wi wi-snow",
      Mist: "wi wi-fog",
      Fog: "wi wi-fog",
      Haze: "wi wi-day-haze"
    };

    const weatherMain = result.weather[0].main;
    weatherIcon.className = iconMap[weatherMain] || "wi wi-day-cloudy";

    locationElement.textContent = `${result.name}, ${result.sys.country}`;
    tempElement.textContent = `${Math.round(result.main.temp - 273.15)}°C`;
    weatherCondition.textContent = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1);
    statusMessage.textContent = `Enjoy your ${result.weather[0].description.toLowerCase()} day.`;
    updateWeatherStats(result);
  });
}

function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + encodeURIComponent(city);

  fetch(locationApi)
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    })
    .catch(() => {
      callback({ success: false, message: "A connection issue stopped the weather request." });
    });
}

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = search.value.trim();

  if (!city) {
    setErrorState("Please enter a city name to continue.");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Checking...";
  showData(city);

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Check Weather";
  }, 1800);
});

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            showData(data.address.city);
          } else {
            setErrorState("We could not detect your city automatically.");
          }
        })
        .catch(() => {
          setErrorState("Location lookup failed. Try searching manually.");
        });
    },
    () => {
      setErrorState("Location access was denied. You can search for a city instead.");
    }
  );
} else {
  setErrorState("Geolocation is not supported in this browser.");
}