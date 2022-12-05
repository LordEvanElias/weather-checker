// Global Variables
const baseURL = "https://api.openweathermap.org";
const apiKey = "173c5a4126dd5897d1b22d250f4ed42f";
const weatherForm = document.querySelector(".weatherForm");
const weatherInput = document.querySelector("#weatherInput");
const searchButton = document.querySelector("#searchButton");
const currentForecast = document.querySelector(".current-forecast");
const fiveDayForecastDiv = document.querySelector(".five-day-forecast");
const citySearch = JSON.parse(localStorage.getItem("cities")) || [];
const previousCities = document.querySelector("#previous-cities");

// Functions

function init() {
  citySearch.forEach((city) => {
    previousCities.innerHTML += `<button id="phil" class="flex flex-wrap p-2 m-2 border" data-city="${city}">${city}</button>`;
  });
}

// Five Day Forecast
function fiveDayForecast(forecastData) {
  console.log(forecastData);

  forecastData.forEach((day) => {
    let midnight = day.dt_txt.split(" ")[1];

    if (midnight === "00:00:00") {
      const date = dayjs(day.dt_txt).format("M/D/YYYY");
      const dayCard = document.createElement("div");
      const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
      dayCard.innerHTML += `<div class= "forecast-day p-6 border"><div>${date}</div><div>${day.main.temp}</div><div>${day.wind.speed}</div><div>${day.main.humidity}</div> <img src="${iconURL}"></div>`;
      fiveDayForecastDiv.append(dayCard);
    }
  });
}
// Current Forecast: Needs to be at top with the 5 day forecast below.
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
  weatherIcon.setAttribute("src", iconURL);
  weatherIcon.setAttribute("class", iconDescription);
  cardHeading.setAttribute("class", "h3 card-title");
  cardBG.setAttribute("class", "background");
  card.setAttribute("class", "card m-2 border-4  text-center align-middle ");
  cardHeading.textContent = `${city}(${date})`;
  cardHeading.append(weatherIcon);
  temperature.textContent = `Temperature: ${temp} F°`;
  humidityElement.textContent = `Humidity: ${humidity} Percent`;
  wind.textContent = `Wind Speed: ${windMPH} MPH`;
  cardBG.append(cardHeading, temperature, wind, humidityElement, weatherIcon);
  card.append(cardBG);
  currentForecast.append(card);
}

function renderItems(city, data) {
  renderCityWeather(city, data.list[0], data.city.timezone);
  fiveDayForecast(data.list);
}

function weatherResponse(location) {
  let { lat } = location;
  let { lon } = location;
  let city = location.name;
  let apiURL = `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

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
  currentForecast.innerHTML = "";
  fiveDayForecastDiv.innerHTML = "";
  if (!event.target.matches("#phil")) {
    return;
  }
  let city = event.target.getAttribute("data-city") || weatherInput.value;

  if (!citySearch.includes(city) && city !== "") {
    citySearch.push(city);
    localStorage.setItem("cities", JSON.stringify(citySearch));
  }

  event.preventDefault();
  const search = city.trim();
  getWeather(search);
  weatherInput.value = "";
}

// Event Listeners
init();
weatherForm.addEventListener("submit", handleForm);
previousCities.addEventListener("click", handleForm);
