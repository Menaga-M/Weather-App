const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/weather", (req,res) => {
    if(!req.query.address){
        return res.send("Address is required");
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});