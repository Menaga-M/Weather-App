var weatherApi = "/weather";
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherIcon = document.querySelector('.weatherIcon i');
const weatherCondition = document.querySelector('.weatherCondition');
const tempElement = document.querySelector('.temperature span');

const locationElement = document.querySelector('.place');
const dateElement = document.querySelector('.date');

const currentDate = new Date();
const options ={month: 'long'};
const monthName = currentDate.toLocaleString('en-US', options);
dateElement.textContent = currentDate.getDate() + " " + monthName + " " + currentDate.getFullYear();

if("geolocation" in navigator){
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude,longitude} = position.coords;
        const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(apiURL).then((response) => {
            response.json().then((data) => {
                if(data && data.address && data.address.city){
                    const city = data.address.city;
                    showData(city);
                }else{
                    locationElement.textContent = "Unable to retrieve city name.";
                }
            }).catch((error) => {
                locationElement.textContent = "Error retrieving city name.";
            });
    }),function (error){
        locationElement.textContent = "Unable to retrieve your location.";
    }
})
}else{
    locationElement.textContent = "Geolocation is not supported by this browser.";
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    locationElement.textContent = "Loading...";
    weatherIcon.className = '';
    tempElement.textContent = '';
    weatherCondition.textContent ="";
    
    showData(search.value);
});

function showData(city){
    getWeatherData(city,(result) => {
        // console.log(result);
        if(result.cod==200){
            if(result.weather[0].description == 'Clouds' || result.weather[0].description == 'fog' || result.weather[0].description == 'Mist'){
                weatherIcon.className = 'wi wi-day-' + result.weather[0].description;
            }else{
                 weatherIcon.className = 'wi wi-day-cloudy';
            }
            locationElement.textContent = result.name + ", " + result.sys.country;
            tempElement.textContent = Math.round(result.main.temp-273.15).toFixed(2) +String.fromCharCode(176)+ "C";
            weatherCondition.textContent = result.weather[0].description.charAt(0).toUpperCase() + result.weather[0].description.slice(1);
        }else{
            locationElement.textContent = "city not found";
        }
    });
}

function getWeatherData(city,callback){
    const locationApi = weatherApi + "?address=" + city;
    fetch(locationApi).then((response) => {
        response.json().then((response) => {
            callback(response);
        });
    })
}