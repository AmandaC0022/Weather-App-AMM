var historyEl = document.getElementById("history"); 
var searchInputEl = document.getElementById("city-input");  
var searchBtn = document.getElementById("search-button"); 
const apiUrl = "api.openweathermap.org"; 

//displays cities from local storage as buttons underneath search 
function displaySavedLocations() {
    var locations = localStorage.getItem("savedLocations"); 
    if (locations) {
        var parsedLocations = JSON.parse(locations); 
        parsedLocations.forEach(function(item) {
            var listItem = document.createElement("li"); 
            var content = `<button data-location="${item}">${item}</button>`; 
            listItem.innerHTML = content; 
            historyEl.appendChild(listItem); 
        }); 
    }
}

//when user clicks on any city button, it will change the content in the current city display 
function updateContentPane(evt) {
    var buttonClicked = evt.target; 
    var location = buttonClicked.getAttribute("data-location"); 
    window.alert(location); 
}

function getLocation(evt) {
    evt.preventDefault(); 
    var location = searchInputEl.value; 
    if (!location) {
        window.alert("Please enter a location"); 
    } 
}

//creates Event Listeners on all of the cities 
function setEventListeners() {
    historyEl.addEventListener("click", updateContentPane); 
    searchBtn.addEventListener("click", getLocation); 
}

//beginning function 
function init() {
    setEventListeners()
    displaySavedLocations(); 

}

init(); 