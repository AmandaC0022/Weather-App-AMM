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

//beginning function 
function init() {
    searchBtn.addEventListener("click", getLocation); 
    //display saved locations from local storage 
    setSavedLocations(); 
    //hides current city display 
    //hides 5 day forecast display 
    }

//gets the user's input and saves it as location 
function getLocation(evt) {
    evt.preventDefault(); 
    var location = searchInputEl.value; 
    console.log(location); 
    //if input is empty, displays error message 
    if(!location) {
        searchErrorMessage.textContent = "Please enter a valid location."
    }
    //only add city to local storage IF the city name isn't already there 
    if(historyLocations.includes(location) === false && location !== "") {
        historyLocations.push(location); 
    }

    setLocalStorage(); 
    //TO DO: create buttons and append them to the li 
    setHistoryButton(location); 
    //run the API call to get weather data for location 
    getApi(location); 
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
        console.log(data)
        
        //displays the current UV Index and Weather Icon 
        currentCityUvEl.textContent = data.current.uvi; 
        var dataIcon = data.current.weather[0].icon; 
        var httpIcon = `http://openweathermap.org/img/wn/${dataIcon}@2x.png`; 
        currentCityIcon.innerHTML = "<img src=" + httpIcon + " alt='weather icon' </img>";  

        for (var i=1; i<=5; i++) {
            //TO DO: create the 5 day forcast cards with data from the api call 
        }
    }); 
}

//when user clicks on history button, weather api is called and generated 
historyEl.addEventListener("click", function(event) {
    //when user clicks on any li, it generates the API for that city's data 
    var city = event.target.getAttribute("data-location"); 
    
    getApi(city); 
})

// This displays the current time in the Current City Display 
var today = moment();
var dayWeek = today.format("dddd"); 
currentDateEl.textContent = dayWeek + " " + today.format("MMM Do, YYYY");

init(); 