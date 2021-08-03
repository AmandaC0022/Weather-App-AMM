var historyEl = document.getElementById("history"); 
var searchInputEl = document.getElementById("city-input");  
var searchBtn = document.getElementById("search-button"); 
var currentCityNameEl = document.getElementById("current-city-name"); 
var currentCityTempEl = document.getElementById("current-city-temp"); 
var currentCityHumidityEl = document.getElementById("current-city-humidity"); 
var currentDateEl = document.getElementById("current-date"); 
var currentCityWindEl = document.getElementById("current-city-wind"); 
var currentCityUvEl = document.getElementById("current-city-uv"); 
var currentCityIcon = document.getElementById("current-city-icon"); 
var searchErrorMessage = document.getElementById("search-error"); 
var fiveDayForcastEl = document.getElementById("five-day-forcast"); 

var historyLocations = []; 
console.log(historyLocations); 

//beginning function 
function init() {
    searchBtn.addEventListener("click", getLocation); 
    //display saved locations from local storage 
    setSavedLocations(); 
    //hides current city display 
    document.querySelector(".current-weather-container").style.display = "none"; 
    //hides 5 day forecast display 
    document.querySelector(".forecast-section").style.display = "none"; 
    }

//gets the user's input and saves it as location 
function getLocation() {
    // evt.preventDefault(); 
    var location = searchInputEl.value.toLowerCase();  
    
    //if input is empty, displays error message 
    if(!location) {
        searchErrorMessage.textContent = "Please enter a valid location."
    }
    //only add city IF the city name isn't already there 
    if(historyLocations.indexOf(location) === -1) {
        historyLocations.push(location); 
        setHistoryButton(location); 
    }

    setLocalStorage(); 
    getApi(location); 
    changeDisplay(); 
}

//sets city names into local storage as an array of strings 
function setLocalStorage() {
    localStorage.setItem("savedLocations", JSON.stringify(historyLocations)); 
}

//when user types in new city, it creates a new button below 
function setHistoryButton(location) {
    var listItem = document.createElement("li");  
    var content = `<button data-location="${location}">${location}</button>`; 
    listItem.innerHTML = content; 
    historyEl.appendChild(listItem); 
}

//creates history buttons from the cities in local storage 
function setSavedLocations() {
    var locations = localStorage.getItem("savedLocations"); 
    //locations isn't empty then... 
    if (locations) {
        parsedLocations = JSON.parse(locations); 
        parsedLocations.forEach(function(item) {
            historyLocations.push(item.toLowerCase()); 
            setHistoryButton(item, locations); 
        }); 
    }
}
//gets data from Weather Api and displays it inside the current city container 
function getApi(location) {
    const apiUrl = "https://api.openweathermap.org"; 
    const appId = "e60fb9490d8e18d47400113b273eeb77"; 

    fetch(`${apiUrl}/data/2.5/weather?q=${location}&units=imperial&appid=${appId}`)
    .then(function (response) {
      return response.json();
  }).then(function(data) {
      currentCityNameEl.textContent = data.name; 
      currentCityTempEl.textContent = data.main.temp + " F"; 
      currentCityWindEl.textContent = data.wind.speed + " MPH"; 
      currentCityHumidityEl.textContent = data.main.humidity + " %"; 

      var lat = data.coord.lat; 
      var lon = data.coord.lon; 

      get5DayApi(location, lat, lon); 
  });
}

function get5DayApi(location, lat, lon) {
    const apiUrl = "https://api.openweathermap.org"; 
    const appId = "e60fb9490d8e18d47400113b273eeb77"; 

    fetch(`${apiUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=${appId}`) 
        .then(function (response) {
        return response.json();
        }).then(function(data) {
        
        //displays the current UV Index and Weather Icon 
        currentCityUvEl.textContent = data.current.uvi; 
        var currentIcon = data.current.weather[0].icon; 
        var httpIcon = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`; 
        currentCityIcon.innerHTML = "<img src=" + httpIcon + " alt='weather icon' </img>";  
        
        //clears the old 5 day forecast before populating it with new content in the for loop 
        fiveDayForcastEl.innerHTML = ""; 

        //creates the 5 day forecast cards 
        for (var i=1; i<=5; i++) {
            var div = document.createElement("div"); 
            div.classList.add("col", "forecast-grid"); 
            fiveDayForcastEl.appendChild(div);
            var date = document.createElement("h5"); 
            nextDay = moment().add(i, "days");  
            date.textContent = nextDay.format("dddd");  
            div.append(date); 
            var newIcon = data.daily[i].weather[0].icon; 
            var img = document.createElement("img");  
            img.setAttribute("src", `http://openweathermap.org/img/wn/${newIcon}@2x.png`); 
            img.setAttribute("alt", "weather icon");  
            div.appendChild(img); 
            var temp = document.createElement("p"); 
            temp.textContent = "Temp: " + data.daily[i].temp.day + " F"; 
            var wind = document.createElement("p"); 
            wind.textContent = "Wind: " + data.daily[i].wind_speed + " MPH"; 
            var humidity = document.createElement("p"); 
            humidity.textContent = "Humidity: " + data.daily[i].humidity + " %"; 
            div.append(temp);
            div.append(wind);
            div.append(humidity);
        }  
    }); 
}

function changeDisplay () {
    document.querySelector(".current-weather-container").style.display = "block"; 
    //hides 5 day forecast display 
    document.querySelector(".forecast-section").style.display = "block";  
}

//when user clicks on history button, weather api is called and generated 
historyEl.addEventListener("click", function(event) {
    //when user clicks on any li, it generates the API for that city's data 
    var city = event.target.getAttribute("data-location"); 
    
    getApi(city); 
    changeDisplay(); 
})

// This displays the current time in the Current City Display 
var today = moment();
var dayWeek = today.format("dddd"); 
currentDateEl.textContent = dayWeek + " " + today.format("MMM Do, YYYY");

init(); 