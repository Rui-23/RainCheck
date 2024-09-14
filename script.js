//Show sidebar
document.querySelector('.handlebar').addEventListener('click', () => {
  document.querySelector('main').classList.toggle('single');
  document.querySelector('aside').classList.toggle('invisible');
});

const us_epa_index = ['Good', 'Moderate', 'Unhealthy for sensitive group', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const uvIndexTable = ['Low', 'Low', 'Moderate', 'Moderate', 'Moderate', 'High', 'High', 'Very High', 'Very High', 'Very High', 'Extreme'];

const toggleBar = document.querySelector('#toggle');

//let myCollection = [{name: 'Shanghai'}, {name: 'Shanghai'}];
let myCollection = ['Shanghai'];
if(localStorage.getItem('myWeatherList')) {
  myCollection = JSON.parse(localStorage.getItem('myWeatherList'));
}

getWeather(myCollection[0]).then(result => {
    renderWeather(result);
    toggleBar.addEventListener('change', () => {
      renderWeather(result);
    });
  });
renderMyCollection();

function renderMyCollection() {
  let time;
  let result;
  let currentDegree;
  let maxtemp;
  let mintemp;
  let text;
  //let citiesHTML = '';
  document.querySelector('aside').innerHTML = '';
  myCollection.forEach(async(item, index) => {
    //let {name} = item;
    result = await getWeather(item);
    text = result.current.condition.text;
    let currentTime = new Date(result.location.localtime);
    time = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
    if(toggleBar.checked) {
      currentDegree = `${result.current.temp_f}°`;
      maxtemp = `H:${result.forecast.forecastday[0].day.maxtemp_f}°`;
      mintemp = `L:${result.forecast.forecastday[0].day.mintemp_f}°`;
    } else {
      currentDegree = `${result.current.temp_c}°`;
      maxtemp = `H:${result.forecast.forecastday[0].day.maxtemp_c}°`;
      mintemp = `L:${result.forecast.forecastday[0].day.mintemp_c}°`;
    }
    const card = `
      <div class="city-card ${item}">
        <div class="left-side">
          <div>
            <h2>${item}</h2>
            <div>${time}</div>
            </div><p>${text}</p>
        </div>
        <div class="right-side">
          <p class="degree">${currentDegree}</p>
          <div>
            <span>${maxtemp}</span> 
            <span>${mintemp}</span>
          </div>
        </div>
        <span class="js-delete-btn"><i class="fa fa-close"></i></span>
      </div>
    `;
  

  document.querySelector('aside').innerHTML += card;

  document.querySelectorAll('.js-delete-btn').forEach((deleteBtn, index) => {
    deleteBtn.addEventListener('click', (e) => {
      let deletedCity = e.target.closest('div').classList[1];
      let deletedIndex = myCollection.indexOf(deletedCity); //solve the DOM random rendering
      e.target.closest('.city-card').remove();
      //myCollection.splice(index, 1);
      myCollection.splice(deletedIndex, 1);
      localStorage.setItem('myWeatherList', JSON.stringify(myCollection));
      console.log(deletedCity + ' has been deleted.');
      console.log(myCollection);
      renderMyCollection();
    });
  });

  document.querySelectorAll('.city-card h2').forEach((cityCard, index) => {
    cityCard.addEventListener('click', (e) => {
      let city = e.target.textContent;
      getWeather(city).then(result => {
        renderWeather(result);
        toggleBar.addEventListener('change', () => {
          renderWeather(result);
        });
      });
    });
  });
  });
}

document.querySelector('#js-add-btn').addEventListener('click', () => {
const city = document.querySelector('.current-location').textContent;
const degree = document.querySelector('.current-degree').textContent;
const text = document.querySelector('.current-temp').textContent;
const maxtemp = document.querySelector('.highest').textContent;
const mintemp = document.querySelector('.lowest').textContent;
let time = new Date();
const currentTime = `${time.getUTCHours()}:${time.getMinutes()}`;

if (myCollection.every(item => item.name !== city)) {
// myCollection.push({name: city});
myCollection.push(city);
localStorage.setItem('myWeatherList', JSON.stringify(myCollection));
console.log(myCollection); 
renderMyCollection();
document.querySelector('#js-add-btn').style.display = 'none';
} else {
console.log('The city is already in your list.')
}
});

document.querySelector('#js-search-btn').addEventListener('click', async () => {
const search = document.querySelector('#search');
const userInput = search.value.toLowerCase();
search.value = '';
if(userInput !== '') {
const URL = `http://api.weatherapi.com/v1/search.json?key=620b8ce73f5d4f70b0582720241906&q=${userInput}`;
const city = await searchCity(URL);
const result = await getWeather(city);
renderWeather(result);
console.log('rendering is done');
toggleBar.addEventListener('change', () => {
  renderWeather(result);
  if (myCollection.every(item => item !== city)) {
    document.querySelector('#js-add-btn').style.display = 'block';
  }
});
} else {
alert('Search area is empty, please enter the city you would like to check.');
return;
}
});

async function searchCity(url) {
try {
document.querySelector('.loading').innerHTML = `<img src="./cartoon-snail-loading.gif">`;
document.querySelector('.loading').style.display = "block";//add loading gif
const response = await fetch(url);
const results = await response.json();
const city = results[0].name;
if (document.querySelector('#js-add-btn').style.display = 'none' && myCollection.every(item => item.name !== city)) {
  document.querySelector('#js-add-btn').style.display = 'block';
} 
console.log(city);
return city;
//getWeather(city);
} catch(err) {
console.log(err);
document.querySelector('.loading').innerHTML = `
<div class='errorBox'>
  <div>Error: No location matched.</div>
  <div>Check the city name before you try again.</div>
</div>
`;
return null;
}
}

async function getWeather(city) {
if (!city) {
return;
}
try {
const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=620b8ce73f5d4f70b0582720241906&q=${city}&days=3&aqi=yes`);
const result = await response.json();
//console.log(result);
return result;
//renderWeather(result);
} catch(err) {
console.log(err);
}
}

function renderWeather(result) {
if (!result) {
return;
}
let currentDegree;
let maxtemp;
let mintemp;
let forecastNextDayMaxtemp;
let forecastNextDayMintemp;
let forecastDay3Maxtemp;
let forecastDay3Mintemp;
let feelslike;
let dewpoint;
const arr1 = result.forecast.forecastday[0].hour;
const arr2 = result.forecast.forecastday[1].hour;
let arr24 = [];
if(toggleBar.checked) {
currentDegree = result.current.temp_f;
maxtemp = result.forecast.forecastday[0].day.maxtemp_f;
mintemp = result.forecast.forecastday[0].day.mintemp_f;
forecastNextDayMaxtemp = result.forecast.forecastday[1].day.maxtemp_f;
forecastNextDayMintemp = result.forecast.forecastday[1].day.mintemp_f;
forecastDay3Maxtemp = result.forecast.forecastday[2].day.maxtemp_f;
forecastDay3Mintemp = result.forecast.forecastday[2].day.mintemp_f;
feelslike = result.current.feelslike_f;
dewpoint = result.current.dewpoint_f;
for (let currentHour = new Date(result.current.
last_updated).getHours(); currentHour < 24; currentHour++) {
  arr24.push({
    hour: currentHour, 
    icon: arr1[currentHour].condition.icon, 
    temp_c: arr1[currentHour].temp_f,
  });
}
let length = arr24.length;
for (let i = 0; i < 24 - length; i++) {
  arr24.push({
    hour: i,
    icon: arr2[i].condition.icon,
    temp_c: arr2[i].temp_f
  });
}
console.log("Change to °F");
} else {
currentDegree = result.current.temp_c;
maxtemp = result.forecast.forecastday[0].day.maxtemp_c;
mintemp = result.forecast.forecastday[0].day.mintemp_c;
forecastNextDayMaxtemp = result.forecast.forecastday[1].day.maxtemp_c;
forecastNextDayMintemp = result.forecast.forecastday[1].day.mintemp_c;
forecastDay3Maxtemp = result.forecast.forecastday[2].day.maxtemp_c;
forecastDay3Mintemp = result.forecast.forecastday[2].day.mintemp_c;
feelslike = result.current.feelslike_c;
dewpoint = result.current.dewpoint_c;
for (let currentHour = new Date(result.current.
last_updated).getHours(); currentHour < 24; currentHour++) {
  arr24.push({
    hour: currentHour, 
    icon: arr1[currentHour].condition.icon, 
    temp_c: arr1[currentHour].temp_c,
  });
}
let length = arr24.length;
for (let i = 0; i < 24 - length; i++) {
  arr24.push({
    hour: i,
    icon: arr2[i].condition.icon,
    temp_c: arr2[i].temp_c,
  });
}
}

const cityName = result.location.name;
if (myCollection.some(item => item === cityName)) {
document.querySelector('#js-add-btn').style.display = 'none';
console.log('The city is already in your list.')
}
const weatherDescription = result.current.condition.text;
const airQualityIndex = result.current.air_quality['us-epa-index'];
const aqInterpretion = us_epa_index[airQualityIndex-1];

const isDay = result.current.is_day;
if (isDay) {
if (weatherDescription.match(/[Ss]unny/)) {
  document.querySelector('body').style.backgroundImage = `url('./images/sunny.jpg')`;
} else if (weatherDescription.match(/[Rr]ain/)) {
  document.querySelector('body').style.backgroundImage = `url('./images/raining.jpg')`;
} else if (weatherDescription.match(/[Oo]vercast/)) {
  document.querySelector('body').style.backgroundImage = `url('./images/overcast.jpg')`;
} else if(weatherDescription.match(/[Cc]loudy/)) {
  document.querySelector('body').style.backgroundImage = `url('./images/cloudy.jpg')`;
} else if(weatherDescription.match(/[Tt]hunder/)) {
  document.querySelector('body').style.backgroundImage = `url('./images/flash.jpg')`;
}
} else {
document.querySelector('body').style.backgroundImage = `url('./images/stars.jpg')`;
}
const weather = `
<div class="general-info">
  <p class="current-location">${cityName}</p>
  <p class="current-degree">${currentDegree}°</p> 
  <p class="current-temp">${weatherDescription}</p>
  <div>
    <span class="highest">H:${maxtemp}°</span>
    <span class="lowest">L:${mintemp}°</span>
  </div>
</div>
<div class="air-quality">
  <p class="title"><i class="material-icons" style="font-size:1em">grain</i> AIR QUALITY</p>
  <h3>${airQualityIndex} - ${aqInterpretion}</h3>
  <p>Current US-EPA-INDEX is ${airQualityIndex}.</p>
</div>
<div class="hourly-forcast">
  <p class="title"><i class="fa fa-clock-o"></i> HOURLY FORECAST</p>
  <div>
    <span>
      <div>Now</div>
      <div>
        <img src = '${arr24[0].icon}'>
      </div>
      <div>${arr24[0].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[1].hour}</div>
      <div>
        <img src = '${arr24[1].icon}'>
      </div>
      <div>${arr24[1].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[2].hour}</div>
      <div>
        <img src = '${arr24[2].icon}'>
      </div>
      <div>${arr24[2].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[3].hour}</div>
      <div>
        <img src = '${arr24[3].icon}'>
      </div>
      <div>${arr24[3].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[4].hour}</div>
      <div>
        <img src = '${arr24[4].icon}'>
      </div>
      <div>${arr24[4].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[5].hour}</div>
      <div>
        <img src = '${arr24[5].icon}'>
      </div>
      <div>${arr24[5].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[6].hour}</div>
      <div>
        <img src = '${arr24[6].icon}'>
      </div>
      <div>${arr24[6].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[7].hour}</div>
      <div>
        <img src = '${arr24[7].icon}'>
      </div>
      <div>${arr24[7].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[8].hour}</div>
      <div>
        <img src = '${arr24[8].icon}'>
      </div>
      <div>${arr24[8].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[9].hour}</div>
      <div>
        <img src = '${arr24[9].icon}'>
      </div>
      <div>${arr24[9].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[10].hour}</div>
      <div>
        <img src = '${arr24[10].icon}'>
      </div>
      <div>${arr24[10].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[11].hour}</div>
      <div>
        <img src = '${arr24[11].icon}'>
      </div>
      <div>${arr24[11].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[12].hour}</div>
      <div>
        <img src = '${arr24[12].icon}'>
      </div>
      <div>${arr24[12].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[13].hour}</div>
      <div>
        <img src = '${arr24[13].icon}'>
      </div>
      <div>${arr24[13].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[14].hour}</div>
      <div>
        <img src = '${arr24[14].icon}'>
      </div>
      <div>${arr24[14].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[15].hour}</div>
      <div>
        <img src = '${arr24[15].icon}'>
      </div>
      <div>${arr24[15].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[16].hour}</div>
      <div>
        <img src = '${arr24[16].icon}'>
      </div>
      <div>${arr24[16].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[17].hour}</div>
      <div>
        <img src = '${arr24[17].icon}'>
      </div>
      <div>${arr24[17].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[18].hour}</div>
      <div>
        <img src = '${arr24[18].icon}'>
      </div>
      <div>${arr24[18].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[19].hour}</div>
      <div>
        <img src = '${arr24[19].icon}'>
      </div>
      <div>${arr24[19].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[20].hour}</div>
      <div>
        <img src = '${arr24[20].icon}'>
      </div>
      <div>${arr24[20].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[21].hour}</div>
      <div>
        <img src = '${arr24[21].icon}'>
      </div>
      <div>${arr24[21].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[22].hour}</div>
      <div>
        <img src = '${arr24[22].icon}'>
      </div>
      <div>${arr24[22].temp_c}°</div>
    </span>
    <span>
      <div>${arr24[23].hour}</div>
      <div>
        <img src = '${arr24[23].icon}'>
      </div>
      <div>${arr24[23].temp_c}°</div>
    </span>
  </div>
</div>
<div class="forecast">
  <p class="title"><i class="fa fa-calendar"></i> 3-DAY FORECAST</p>
  <div>
    <div>
      <span>Today</span>
      <span><img src = '${result.current.condition.icon}'></span>
      <span>
        <span>${mintemp}°</span>
        <progress value="${result.current.heatindex_c}" min="27" max="43"></progress>
        <span>${maxtemp}°</span>
      </span>
    </div>
    <div>
      <span>${days[new Date(result.forecast.forecastday[1].date).getDay()]}
      </span>
      <span>
        <img src="${result.forecast.forecastday[1].day.condition.icon}">
      </span>
      <span>
        <span>${forecastNextDayMintemp}°</span>
        <progress value="${result.current.heatindex_c}" min="27" max="43"></progress>
        <span>${forecastNextDayMaxtemp}°</span>
      </span>
    </div>
    <div>
      <span>${days[new Date(result.forecast.forecastday[2].date).getDay()]}
      </span>
      <span>
        <img src="${result.forecast.forecastday[2].day.condition.icon}">
      </span>
      <span>
        <span>${forecastDay3Mintemp}°</span>
        <progress value="${result.current.heatindex_c}" min="27" max="43"></progress>
        <span>${forecastDay3Maxtemp}°</span>
      </span>
    </div>
  </div>
</div>
<div class="astro">
  <div>
    <p class="title">SUNRISE</p>
    <div>${result.forecast.forecastday[0].astro.sunrise}</div>
  </div>
  <div>
    <p class="title">SUNSET</p>
    <div>${result.forecast.forecastday[0].astro.sunset}</div>
  </div>
  <div>
    <p class="title">MOONRISE</p>
    <div>${result.forecast.forecastday[0].astro.moonrise}</div>
  </div>
  <div>
    <p class="title">MOONSET</p>
    <div>${result.forecast.forecastday[0].astro.moonset}</div>
  </div>
</div>
<div class="other-info">
  <div class="uv">
    <p class="title">☀︎ UV INDEX</p>
    <div>${result.current.uv}</div>
    <div>${uvIndexTable[result.current.uv - 1]}</div>
  </div>
  <div class="feels-like">
    <p class="title"><i class="fa fa-thermometer-2"></i> FEELS LIKE</p>
    <div>${feelslike}°</div>
    <p>Humidity is making it feel hotter.</p>
  </div>
  <div class="humidity">
    <p class="title"><i class="fa fa-tint"></i> HUMIDITY</p>
    <div>${result.current.humidity}%</div>
    <p>The dew point is ${dewpoint}° right now.</p>
  </div>
  <div class="visibility">
    <p class="title"><i class="material-icons" style="font-size:1em">visibility</i> VISIBILITY</p>
    <div>${result.current.vis_km}km</div>
    <p>It's perfectly clear right now.</p>
  </div>
  <div class="pressure">
    <p class="title"><i class="fa fa-tachometer"></i> PRESSURE</p>
    <div>${result.current.pressure_mb} hPa</div>
  </div>
  <div class="chances-of-rain">
    <p class="title"><i class="fa fa-umbrella"></i> CHANCE OF RAIN</p>
    <div>${result.forecast.forecastday[0].day['daily_chance_of_rain']}%</div>
  </div>
  <div class="wind">
    <p class="title">🌬️ WIND</p>
    <div>${result.current.wind_dir} ${result.current.wind_mph}m/s</div>
  </div>
`;
document.querySelector('.weather-container').innerHTML = weather;
document.querySelector('.loading').style.display = "none";//remove loading gif
}