require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherData = require("../utils/weatherData.js");

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.render("index", { title: "Weatherly" });
});

app.get("/weather", (req, res) => {
  const address = req.query.address;

  if (!address || !address.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter a city name to check the weather."
    });
  }

  weatherData(address.trim(), (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "We could not fetch weather data right now. Please try again."
      });
    }

    if (!result || result.cod !== 200) {
      return res.status(404).json({
        success: false,
        message: result?.message || "We couldn't find weather for that location."
      });
    }

    res.json({
      success: true,
      ...result
    });
  });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});