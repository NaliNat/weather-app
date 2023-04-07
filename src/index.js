function getLiveData() {
  navigator.geolocation.getCurrentPosition(retrieveCityWeatherLive);
}

function retrieveCityWeatherLive(position) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`;
  tempFlag = true;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function changeCity(event) {
  event.preventDefault();
  sentence = ``;
  let newCity = document.querySelector("#city-box");
  if (newCity.value) {
    let oldCity = document.querySelector("#city-name");
    oldCity.innerHTML = newCity.value;
    retrieveCityWeather(newCity.value);
    document.querySelector("#city-box").value = "";
  } else {
    getLiveData();
  }
}

function updateDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = date.getDay();

  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${days[day]}, ${hour}:${minutes}`;
}

function changeTemp(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");

  if (event.target.id === "celsius" && tempFlag === false) {
    retrieveCityWeather(document.querySelector("#city-name").innerHTML);
    sentence = ``;
  } else {
    if (tempFlag === true && event.target.id === "fahr") {
      temperature.innerHTML = `${Math.round(
        (temperature.innerHTML * 9) / 5 + 32
      )}`;
      tempFlag = false;
    }
  }
}

function createSentence(element) {
  if (sentence !== ``) {
    sentence = `${sentence}, ${element.description}`;
  } else {
    sentence = `${element.description}`;
  }
}

function showTemperature(response) {
  let city = document.querySelector("#city-name");
  city.innerHTML = response.data.name;

  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = `${Math.round(response.data.main.temp)}`;

  let weather = document.querySelector("#weather");
  response.data.weather.forEach(createSentence);
  weather.innerHTML = `${sentence}`;

  let forecastMin = document.querySelector("#current-min-temp");
  forecastMin.innerHTML = `${Math.round(response.data.main.temp_min)}°`;

  let forecastMax = document.querySelector("#current-max-temp");
  forecastMax.innerHTML = `${Math.round(response.data.main.temp_max)}°`;

  let windSpeed = document.querySelector("#windspeed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);

  let dateElement = document.querySelector("#date-info");
  dateElement.innerHTML = updateDate(response.data.dt);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function retrieveCityWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  tempFlag = true;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

getLiveData();

let tempFlag = false;
let apiKey = "bfe034c79313e4c85038991db35fe483";
let sentence = ``;

let text = document.querySelector("#input-city");
text.addEventListener("submit", changeCity);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeTemp);

let fahr = document.querySelector("#fahr");
fahr.addEventListener("click", changeTemp);

let currentButton = document.querySelector("#current-btn");
currentButton.addEventListener("submit", changeCity);
