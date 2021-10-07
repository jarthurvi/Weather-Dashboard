$(document).ready(function(){

    console.log("connected")

    let apiKey = "1b05cb3a72a5e52be5d8f9db3dec6e0d";


$("#searchbtn").on("click", function(event){
    event.preventDefault();

    // getting value of userinput search
    let userSearch = $("#cities").val();
    console.log("userSearch", userSearch)

    // passing user input search to get current weather function
getCurrentWeather(userSearch);

})

function getCurrentWeather(userSearch){
console.log("userssearch in get current weather function", userSearch)

let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userSearch}&appid=${apiKey}&units=imperial`

console.log("queryUrl", queryUrl)
fetch(queryUrl)
.then(response => response.json())
.then(function(data){
    console.log("GET CURRENT WEATHER CALL",data)

    // dynamically creating h2 and giving it bootstrap class 
let cityName = $("<h2 class='card-title'>").text(data.name);
    // dynamically creating div and giving it bootstrap class and adding data too it.
let temp = $("<div class='card-text'>").text("Temperature: " + data.main.temp + "F");
let humidity = $("<div class='card-text'>").text("Humidity: " + data.main.humidity + "%");
let wind = $("<div class='card-text'>").text("Wind Speed: " + data.wind.speed + "MPH" );
let icon = $(`<img src='http://openweathermap.org/img/wn/${data.weather[0].icon}.png'>`)

// adding all dynamically created elements to the currentweather div
$("#currentWeather").append(cityName, icon, temp, humidity, wind);

// getting coordinates to pass to one call api to get 5 day forecast and uvindex
let coords = {
    lat: data.coord.lat,
    lon: data.coord.lon
}

getUVIndex(coords)
})
}

function getUVIndex(coords){
    let queryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=imperial`;

    fetch(queryUrl)
    .then(response => response.json())
    .then(function(data){
    console.log("ONE CALL API ",data)

        for(var i = 1; i < 6; i++){
           console.log('Looping thru 5 day forecast', data.daily[i])
           console.log(i)

           
           let card = $("<div class='card col-md-2'>")
           let cardTitle = $("<div class='card-title'>").text( moment().add(5,'days').format('DD/MM/YYYY')// go thru moment.js and post next consecutive 5 days
            )
            card.append(cardTitle)
            $("#forecast").append(card)

            let temp = $("<div class='card-text'>").text("Temperature: " + data.daily[i].temp.day + "F" )
            card.append(temp)
            $("#forecast").append(card)

            let windSpeed = $("<div class='card-text'>").text("Wind Speed: " + data.daily[i].wind_speed + "MPH" )
            card.append(windSpeed)
            $("#forecast").append(card)

            let humiDity = $("<div class='card-text'>").text("Humidity:" + data.daily[i].humidity + "%" )
            card.append(humiDity)
            $("#forecast").append(card)
        }

    // UV INDEX data and rendering
    let UVIndex = data.current.uvi;
    let UVIndexElement = $("<button class='card-text btn btn-sm'>").text("UV Index: " + UVIndex )

    // Testing if uvindex is high or low and changing color depnding upon...
    if(UVIndex < 3){
        UVIndexElement.addClass("btn-success");
    } else if(UVIndex < 7){
        UVIndexElement.addClass("btn-warning");
    } else{
        UVIndexElement.addClass("btn-danger");
    }

    // appending uvindex to currentweather div
    $('#currentWeather').append(UVIndexElement);

})
}











})