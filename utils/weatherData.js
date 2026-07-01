const request = require("request");

const openWeatherApp = {
    BASE_URL:"https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY:"7efa3f34865a7cec8da4e3d3e21f914a"
}

const weatherData = (address, callback) => {
    const url = openWeatherApp.BASE_URL +
     encodeURIComponent(address)+
     "&APPID="+
     openWeatherApp.SECRET_KEY;
     console.log(url);

     request({url,json:true},(error,data) => {
        if(error){
            callback(true,"Unnable to fetch data,please try again" + error);
        } else {
            callback(false,data?.body);
        }
     })
}