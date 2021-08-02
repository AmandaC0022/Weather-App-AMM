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

const historyLocations = []; 
const apiUrl = "https://api.openweathermap.org"; 
const appId = "e60fb9490d8e18d47400113b273eeb77"; 

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

//Once you receive the fetch data back, you do this: 
function handleSuccessfulLocationFetch(location) {
    // Adds city to the li as a button 
    createHistoryButton(location); 
    // add city to local storage array 
    setLocalStorage(location); 
}; 

function getApi(location) {
    
    //fetch url 
    var url = `${apiUrl}/data/2.5/find?q=` + location + `&units=imperial&appid=${appId}`; 

    fetch(url)
    .then(function(response) {
        //if response is NOT ok then log the status to the console 
        if (!response.ok) {
            // console.log("then", response.status);  
        }
        return response.json()
    }).then(function (data) {
        // console.log("data", data); 
        //TO DO: add data directly to textContent in current city display grab data to show in the large container 
        // currentCityNameEl.textContent = data.list[0].name; 

        console.log("take 2", data); 

        var lat = data.coord.lat; 
        var lon = data.coord.lon; 

        getFiveDayApi(lat, lon); 

        handleSuccessfulLocationFetch(location); 
         
        //if something goes wrong with fetching the data, then console log this message 
    }).catch(function () {
        console.log("something went wrong"); 
    })
}; 

//this turns each of the cities into a button in the li 
function createHistoryButton(location, historyLocations) {
    var listItem = document.createElement("li"); 
    var content = `<button data-location="${location}">${location}</button>`; 
    listItem.innerHTML = content; 
    historyEl.appendChild(listItem); 
}

//displays cities from local storage as buttons underneath search 
function displaySavedLocations() {
    //getting the city name from local storage 
    var locations = localStorage.getItem("savedLocations"); 
    //locations isn't empty then... 
    if (locations) {
        parsedLocations = JSON.parse(locations); 
        parsedLocations.forEach(function(item) {
            historyLocations.push(item.toLowerCase()); 
            createHistoryButton(item, historyLocations); 
        }); 
    }
}

//places the city name into local storage 
function setLocalStorage(location) {
    localStorage.setItem("savedLocations", JSON.stringify(location));  
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
    if(!location) {
        searchErrorMessage.textContent = "Please enter a valid location."
    }
    // displaySavedLocations(); 
    getApi(location);  
}

//creates Event Listeners on all of the cities 
function setEventListeners() {
    historyEl.addEventListener("click", getApi); 
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