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
var parsedLocations = [];

//maybe a place to hold all of the needed data from the fetch?? 
// var currentCityObject = {
//     name:"", 
//     lat:"",
//     lon:"", 
//     temp:"", 
//     wind:"", 
//     humidity:"", 
//     uv:"", 
//     icon:"", 
// }

const historyLocations = []; 
const apiUrl = "https://api.openweathermap.org"; 
const appId = "e60fb9490d8e18d47400113b273eeb77"; 

// Trey's Craziness! 
// //Once you receive the fetch data back, you do this: 
// function handleSuccessfulLocationFetch(data, location) {
//     // Adds city to the li as a button 
//     createHistoryButton(location); 
//     // add city to local storage array 
//     setLocalStorage(location); 
//     // display city data to current city display
//     updateContentPane(evt); 
// }; 

// function getFiveDayApi(lat, lon) {
//     var url = ${apiUrl} // get rest of url 
//     //get 1 callapi, exclude minutes, hourly 
//     fetch(url)
//     .then(function (response) {
//        return response.json(); 
//     })
//     .then(function(data) {
//         console.log(data); 
//         //use this to clean the old data before getting the new data from this fetch! 
//         // while() {
//         //     .removeChild(); 
//         // }
//         for (var i=1; i<6; i++) {
//             //grab and append all of your new data 
//             //make new cards here... not just append create it all here 
//             //var iconHttp = "http://openweathermap.org/img/wn/" + icon + "@2x.pgn"; 
//         }
//         //show UV index to current city display data.current.uvi 
//     })
// }

//this turns each of the cities into a button in the li 
function createHistoryButton(location, parsedLocations) {
    var listItem = document.createElement("li"); 
    var content = `<button data-location="${location}">${location}</button>`; 
    listItem.innerHTML = content; 
    historyEl.appendChild(listItem); 
}

//
function setLocalStorage() {
    var locations = localStorage.getItem("savedLocations"); 
    if (locations) {
        parsedLocations = JSON.parse(locations);   
    } 
}

//displays cities from local storage as buttons underneath search 
function displaySavedLocations() {
    var locations = localStorage.getItem("savedLocations"); 
    if (locations) {
        parsedLocations = JSON.parse(locations); 
        parsedLocations.forEach(function(item) {
            historyLocations.push(item.toLowerCase()); 
            console.log(historyLocations); 
            createHistoryButton(item, parsedLocations); 
        }); 
    }
}

function getApi(location) {
    //fetch url 
    var url = `${apiUrl}/data/2.5/find?q=${location}&units=imperial&appid=${appId}`; 

    fetch(url)
    .then(function(response) {
        //if response is NOT ok then log the status to the console 
        if (!response.ok) {
            console.log(response.status);  
        }
        return response.json()
    }).then(function (data) {
        console.log("data", data); 
        //TO DO: add data directly to textContent in current city display grab data to show in the large container 


        // Data for City Name 
        // // currentCityObject.name = data.list[0].name; 
        // // Data for city latitude 
        // currentCityObject.lat = data.list[0].coord.lat; 
        // // Data for city longitude 
        // currentCityObject.lon = data.list[0].coord.lon; 
        // // data for city temperature 
        // // currentCityObject.temp = data.list[0].main.temp;  
        // // // data for city humidity 
        // // currentCityObject.humidity = data.list[0].main.humidity; 
        // // // data for city wind speed 
        // // currentCityObject.wind = data.list[0].wind.speed; 

        //if city is not found then display error message below search button 
        if (data.count === 0) {
            searchErrorMessage.textContent = "Please enter a valid location."
        } 

        var lat = data.coord.lat; 
        var lon = data.coord.lon; 

        getFiveDayApi(lat, lon); 

        //if something goes wrong with fetching the data, then console log this message 
    }).catch(function () {
        console.log("something went wrong"); 
    })
}; 

//when user clicks on any city button, it will change the content in the current city display 
function updateContentPane(evt) {
    var buttonClicked = evt.target; 
    var location = buttonClicked.getAttribute("data-location"); 
    currentCityNameEl.textContent = location; 
    currentCityTempEl.textContent =  currentCityObject.temp + " F"; 
    currentCityHumidityEl.textContent = currentCityObject.humidity + " %"; 
    currentCityWindEl.textContent = currentCityObject.wind + " MPH";  
    getApi(location); 
}

//this gets the user input for the city, then gets fetches the data from the open weather app 
function getLocation(evt) {
    //always add this if you have a form or form input 
    evt.preventDefault(); 
    var location = searchInputEl.value; 
    
    //if new location is NOT in local storage and doesn't = empty, then add it to my li 
    if(parsedLocations.includes(location) === false && location !== "") {
        parsedLocations.push(location); 
    }

    //if input is empty then alert message shows
    if (!location) {
        searchErrorMessage.textContent = "Please enter a valid location.";  
    } 
    //saves new data into local storage 
    setLocalStorage(); 
    
    getApi(location);  
}

//creates Event Listeners on all of the cities 
function setEventListeners() {
    historyEl.addEventListener("click", updateContentPane); 
    searchBtn.addEventListener("click", getLocation); 
}

// This displays the current time in the Current City Display 
var today = moment();
var dayWeek = today.format("dddd"); 
currentDateEl.textContent = dayWeek + " " + today.format("MMM Do, YYYY");

//beginning function 
function init() {
    setEventListeners(); 
    displaySavedLocations(); 
}

init(); 