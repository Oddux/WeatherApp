const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherEl = document.getElementById("currentWeather");
const timezone = document.getElementById("time-zone");
const weatherForecastEl = document.querySelector(".forecast");
const currentTempEl = document.getElementById("current-temp");
const searchBtn = document.querySelector(".searchBtn")
const cityInput = document.querySelector(".cityInput")

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "7d5fd526c0c5eb86bc39ced6e92a3920";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&limit=1&appid=${API_KEY}&units=imperial`;
  getWeatherData(cityName);
  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      getWeatherDetails(data);
    })
    .catch(() => {
      alert("An error occurred while fetching the data!");
    });
};

function getWeatherDetails(data) {
  weatherForecastEl.innerHTML =""
  for (i =2; i < data.list.length; i = i +8) {
    console.log(data.list[i])
    weatherForecastEl.innerHTML += `<div class="advanceForecast">
    <div class ="day">${dayjs.unix(data.list[i].dt).format("MM/DD/YYYY")}</div>
    <div class ="conditions">
        <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="weather icon" class="weatherIcon">
    </div>
    <div class ="temp">Day - ${data.list[i].main.temp}</div>                
</div>`
    }
//  weatherForecastEl.innerHTML = otherDayForecast;
}


function getWeatherData(cityName) {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let {humidity, pressure, temp} = data.main;
  let {speed} = data.wind

  cityName.innerHTML= `<h1 id="cityName">${data.name}</h1>;`

  currentWeatherEl.innerHTML = `
  <div class ="conditions">${data.weather[0].main}
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="weatherIcon">
    </div>

    <div class="temp">
        <div>Temp</div>
        <div>${temp}%</div>
    </div>
      <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${speed}</div>
    </div>
    `;
}

searchBtn.addEventListener("click", getCityCoordinates);

