var historyEl = document.getElementById("history"); 

function displaySavedLocations() {
    var locations = ["Chicago", "Washington DC"]; 
    locations.forEach(function(item) {
        var listItem = document.createElement("li"); 
        var content = `<button data-location="${item}">${item}</button>`; 
        listItem.innerHTML = content; 
        historyEl.appendChild(listItem); 
    }); 
}

function init() {
    displaySavedLocations(); 
}

init(); 