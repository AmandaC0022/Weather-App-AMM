var historyEl = document.getElementById("history"); 
var searchInputEl = document.getElementById("city-input");  
var searchBtn = document.getElementById("search-button"); 
var currentCityNameEl = document.getElementById("current-city-name"); 
var currentCityTempEl = document.getElementById("current-city-temp"); 
var currentCityHumidityEl = document.getElementById("current-city-humidity"); 
var currentDateEl = document.getElementById("current-date"); 

var today = moment();
currentDateEl.textContent = today.format("MMM Do, YYYY");

var currentCityObject = {
    name:"", 
    lat:"",
    lon:"", 
    temp:"", 
    humidity:"", 
}

const historyLocations = []; 
const apiUrl = "https://api.openweathermap.org"; 
const appId = "e60fb9490d8e18d47400113b273eeb77"; 
 

//displays cities from local storage as buttons underneath search 
function displaySavedLocations() {
    var locations = localStorage.getItem("savedLocations"); 
    if (locations) {
        var parsedLocations = JSON.parse(locations); 
        parsedLocations.forEach(function(item) {
            historyLocations.push(item.toLowerCase()); 
            createHistoryButton(item, parsedLocations); 
        }); 
    }
}

//Once you receive the fetch data back, you do this: 
function handleSuccessfulLocationFetch(data, location) {
    // Add city to li 
    createHistoryButton(location); 
    // add city to local storage 
    setLocalStorage(location); 
    // display city data to current city display
    updateContentPane(evt); 
    //fetch 5 day forecast  

    //link this url to current city lat and lon 
    // var url = `${apiUrl}/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt={cnt}&units=imperial&appid=${appId}`; 

    // fetch(url).then(function(response) {
    //     //if response is NOT ok then log the status to the console 
    //     if (!response.ok) {
    //         console.log(response.status);  
    //     }
    //     return response.json()
    // }).then(function (data) {
    //     console.log("data", data);
    //     //append new data to the 5 day forecast  
    //     if (data.count === 0) {
    //         window.alert("this is not a valid location"); 
    //     } 
    // }).catch(function () {
    //     window.alert("something went wrong"); 
    // })
}; 

function setLocalStorage(location) {
    var locations = localStorage.getItem("savedLocations");
    var parsedLocations = []; 
    if (locations) {
        parsedLocations = JSON.parse(locations);  
    } 
    //soon as it finds the item in the array that you are looking for, it stops iteratering over the array 
    var hasLocation = parsedLocations.some(function(loc) {
       return loc.toLowerCase() === location.toLowerCase(); 
    })

    if (!hasLocation) {
        parsedLocations.push(location);
        localStorage.setItem("savedLocations", JSON.stringify(parsedLocations)); 
    } 
}

//this turns each of the cities into a button in the li 
function createHistoryButton(location, parsedLocations) {
    var listItem = document.createElement("li"); 
    var content = `<button data-location="${location}">${location}</button>`; 
    listItem.innerHTML = content; 
    historyEl.appendChild(listItem); 
}

//when user clicks on any city button, it will change the content in the current city display 
function updateContentPane(evt) {
    var buttonClicked = evt.target; 
    var cityName = buttonClicked.getAttribute("data-location"); 
    currentCityNameEl.textContent = cityName; 
    currentCityTempEl.textContent =  currentCityObject.temp + " F"; 
    currentCityHumidityEl.textContent = currentCityObject.humidity + " %"; 
}

//this gets the user input for the city, then gets fetches the data from the open weather app 
function getLocation(evt) {
    evt.preventDefault(); 
    var location = searchInputEl.value; 
    
    //if input is empty then alert message shows 
    if (!location) {
        window.alert("Please enter a location"); 
    } 

    //fetch url 
    var url = `${apiUrl}/data/2.5/find?q=${location}&units=imperial&appid=${appId}`; 

    fetch(url).then(function(response) {
        //if response is NOT ok then log the status to the console 
        if (!response.ok) {
            console.log(response.status);  
        }
        return response.json()
    }).then(function (data) {
        console.log("data", data); 
        currentCityObject.name = data.list[0].name; 
        currentCityObject.lat = data.list[0].coord.lat; 
        currentCityObject.lon = data.list[0].coord.lon; 
        currentCityObject.temp = data.list[0].main.temp;  
        currentCityObject.humidity = data.list[0].main.humidity; 
        console.log(currentCityObject); 

        if (data.count === 0) {
            window.alert("this is not a valid location"); 
        } 
        handleSuccessfulLocationFetch(data, location); 
    }).catch(function () {
        console.log("something went wrong"); 
    })
}

//creates Event Listeners on all of the cities 
function setEventListeners() {
    historyEl.addEventListener("click", updateContentPane); 
    searchBtn.addEventListener("click", getLocation); 
}

//beginning function 
function init() {
    setEventListeners(); 
    displaySavedLocations(); 
}

init(); 