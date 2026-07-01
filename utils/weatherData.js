const request = require("request");

const openWeatherApp = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: process.env.OPEN_WEATHER_API_KEY
};

const weatherData = (address, callback) => {
  const url = openWeatherApp.BASE_URL + encodeURIComponent(address) + "&APPID=" + openWeatherApp.SECRET_KEY;

  request({ url, json: true }, (error, response) => {
    if (error) {
      callback(true, { message: "Unable to fetch weather data. Please try again." });
    } else {
      callback(false, response.body);
    }
  });
};

module.exports = weatherData;