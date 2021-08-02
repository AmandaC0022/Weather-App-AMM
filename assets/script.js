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

var historyLocations = []; 
//beginning function 
function init() {
    searchBtn.addEventListener("click", getLocation); 
    //display saved locations from local storage 
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
//gets data from Weather Api and displays it inside the current city container 
function getApi(location) {
    const apiUrl = "https://api.openweathermap.org"; 
    const appId = "e60fb9490d8e18d47400113b273eeb77"; 

    fetch(`${apiUrl}/data/2.5/weather?q=${location}&units=imperial&appid=${appId}`)
    .then(function (response) {
      return response.json();
  }).then(function(data) {
      console.log(data)

      currentCityNameEl.textContent = data.name; 
      currentCityTempEl.textContent = data.main.temp + " F"; 
      currentCityWindEl.textContent = data.wind.speed + " MPH"; 
      currentCityHumidityEl.textContent = data.main.humidity + " %"; 

      var lat = data.coord.lat; 
      var lon = data.coord.lon; 
  });
}

// This displays the current time in the Current City Display 
var today = moment();
var dayWeek = today.format("dddd"); 
currentDateEl.textContent = dayWeek + " " + today.format("MMM Do, YYYY");

init(); 