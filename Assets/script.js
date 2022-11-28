// Global Variables
const baseURL = "https://api.openweathermap.org";
const apiKey = "173c5a4126dd5897d1b22d250f4ed42f";
const weatherForm = document.querySelector(".weatherForm");
const weatherInput = document.querySelector("#weatherInput");
const searchButton = document.querySelector("#searchButton");
const currentForecast = document.querySelector(".current-forecast");

// Functions

function renderCityWeather(city, weather) {
  const date = dayjs().format("M/D/YYYY");
  const temp = weather.main.temp;
  const windMPH = weather.wind.speed;
  const humidity = weather.main.humidity;
  const iconURL = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  const iconDescription = weather.weather[0].description || weather[0].main;
  const card = document.createElement("div");
  let cardBG = document.createElement("div");
  let cardHeading = document.createElement("h2");
  let weatherIcon = document.createElement("img");
  let temperature = document.createElement("p");
  let wind = document.createElement("p");
  let humidityElement = document.createElement("p");
  humidityElement.setAttribute("class", "card-text");
  wind.setAttribute("class", "card-text");
  temperature.setAttribute("class", "card-text");
  weatherIcon.setAttribute("class", "weather-img");
  weatherIcon.setAttribute("class", iconURL);
  weatherIcon.setAttribute("class", iconDescription);
  cardHeading.setAttribute("class", "h3 card-title");
  cardBG.setAttribute("class", "background");
  card.setAttribute("class", "card");
  cardHeading.textContent = `${city}(${date})`;
  cardHeading.append(weatherIcon);
  temperature.textContent = `Temperature: ${temp} F°`;
  humidityElement.textContent = `Humidity: ${humidity}`;
  wind.textContent = `Wind Speed: ${windMPH}`;
  cardBG.append(cardHeading, temperature, wind, humidityElement);
  card.append(cardBG);
  currentForecast.append(card);
}

function renderItems(city, data) {
  renderCityWeather(city, data.list[0], data.city.timezone);
}

function weatherResponse(location) {
  let { lat } = location;
  let { lon } = location;
  let city = location.name;
  let apiURL = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(city, data);
      renderItems(city, data);
    });
}

function getWeather(search) {
  let apiURL = `${baseURL}/geo/1.0/direct?q=${search}&appid=${apiKey}`;

  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("No Location Found");
      } else {
        weatherResponse(data[0]);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleForm(event) {
  if (!weatherInput.value) {
    return;
  }

  event.preventDefault();
  const search = weatherInput.value.trim();
  getWeather(search);
  weatherInput.value = "";
}

// Event Listeners
weatherForm.addEventListener("submit", handleForm);
