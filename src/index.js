function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;
  let forecastDays = response.data.daily;

  forecastDays.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
              <div class="day">${formatDay(forecastDay.dt)}</div>
              <img
                src="https://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt="Icon"
                class="icon-forecast"
              />

              <div class="temp"><span class="max-temp">${Math.round(
                forecastDay.temp.max
              )}°</span> <span class="min-temp">${Math.round(
          forecastDay.temp.min
        )}°</span></div>
      </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let long = coordinates.lon;
  let lat = coordinates.lat;
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${`34ae1065362d42545661451bda2b8a1f`}&units=metric`;

  axios.get(apiURL).then(displayForecast);
}

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
    fahr.classList.remove("active");
    celsius.classList.add("active");
  } else {
    if (tempFlag === true && event.target.id === "fahr") {
      temperature.innerHTML = `${Math.round(
        (temperature.innerHTML * 9) / 5 + 32
      )}`;
      tempFlag = false;
      celsius.classList.remove("active");
      fahr.classList.add("active");
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
  iconElement.setAttribute("alt", response.data.weather[0].descriptionx);

  getForecast(response.data.coord);
}

function retrieveCityWeather(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  tempFlag = true;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

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

retrieveCityWeather("Madrid");
