const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is up and running on port 3000!");
});

app.post("/", function (req, res) {
  if(req.body.cityRadio === "other"){
    var city = req.body.cityName;
  }else{
    var city = req.body.cityRadio;
  }
  var query = "";
  city = city.split(" ");
  for (let i = 0; i < city.length; i++) {
    query = query + city[i].slice(0, 1).toUpperCase() + city[i].slice(1) + " ";
  }
  const apiKey = "9a2a39a6da819de9b03d156235494b78";
  const unit = req.body.unitType;
  var unitShow = "Celsius";
  if (unit === "metric") {
    unitShow = "Celsius";
  } else if (unit === "imperial") {
    unitShow = "Fahrenheit";
  }else{unitShow = "Kelvin"}
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    console.log("Getting location status message- " + response.statusCode);

    response.on("data", function (data) {
      const locationData = JSON.parse(data);
      const location = {
        lon: locationData.coord.lon,
        lat: locationData.coord.lat
      }
      const url2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + location.lat + "&lon=" + location.lon + "&exclude=current,minutely,hourly,alerts&units=" + unit + "&appid=" + apiKey;
      https.get(url2, function(response){
        console.log("Getting weather status message- " + response.statusCode);

        response.on("data", function(data){
          const weatherData = JSON.parse(data);
          var firstDay = weatherData.daily[0].dt + "000";
          firstDay = Number(firstDay) + 25200000;
          firstDay = new Date(firstDay);
          firstDay = firstDay.getDay();  //Checking what the first day that is being checked is, to make sure we get only the days that are still left in the week and not any extras.
          daysArray = [];
          for (let i = 0; i < 7 - firstDay; i++) {  //Creating an object with all the info for each day of the week till saturday.
            daysArray[i]={
              dayOfWeek: whatDay(i + firstDay),
              temp: weatherData.daily[i].temp.eve,
              descId: weatherData.daily[i].weather[0].id,
              mainDesc: weatherData.daily[i].weather[0].main,
              desc: weatherData.daily[i].weather[0].description,
              iconId: weatherData.daily[i].weather[0].icon,
              score: 0
            }
            daysArray[i].score = calcScore(daysArray[i].temp, daysArray[i].mainDesc, daysArray[i].descId);  //Calculating the score for each day.
            
          }
          daysArray.sort(function(a, b){return a.score - b.score});
          res.write("<h1>Best days to run in " + query + "!</h1>");
          for (let j = 0; j < 7 - firstDay; j++) {
            res.write("<br>" + (j + 1) + ". <strong>" + daysArray[j].dayOfWeek + "</strong><br>");
            res.write("<img style='width: 4%;' src=http://openweathermap.org/img/wn/" + daysArray[j].iconId + "@2x.png><p style='font-size: 24px; display: inline;'>" + daysArray[j].mainDesc + "</p><br>");
            res.write("Temprature: <strong>" + daysArray[j].temp + "</strong> degrees " + unitShow + "<br>");
            res.write("Description: " + daysArray[j].desc + "<br>");            
          }
          res.send();
        });
      });
    });
  });
});

function calcScore(temp, mainDesc, id){
  var tempScore;
  switch (mainDesc) {
    case "Clear":
      tempScore = 0;
      if(temp >= 30 && temp <= 35){
        tempScore += 8;
      }else if(temp > 35){
        tempScore += 15;
      }
      break;
    case "Clouds":
      if(id > 802){
        tempScore = 3;
        if(temp >= 30 && temp <= 35){
          tempScore += 8;
        }else if(temp > 35){
          tempScore += 15;
        }
      }else{
        tempScore = 5;
        tempScore += (id%800)*3;
      }
      break;
    case "Snow":
      if(id < 603 && id > 599){
        tempScore = 12;
        tempScore += (id%600)*3;
      }else if(id > 610 && id < 614){
        tempScore = 17;
        tempScore += id%600;
      }else if(id === 615 || id === 616){
        tempScore = 13;
        tempScore += id%600 + (id%615)*2;
      }else{
        tempScore = 24;
        tempScore += (id%619)*5;
      }
      break;
    case "Drizzle":
      tempScore = 15;
      if(id < 303){
        tempScore += (id%300)*9;
      }else{
        tempScore += id%300;
      }
      break;
    case "Rain":
      if(id < 505){
        tempScore = 22;
        tempScore += (id%500)*4;
      }else if(id === 511){
        tempScore = 52;
      }else{
        tempScore = 6;
        tempScore += id%500;
      }
      break;
    case "Thunderstorm":
      if(id < 203){
        tempScore = 22;
        tempScore += (id%200)*5;
      }else if(id > 203 && id < 213){
        tempScore = 14;
        tempScore += (id%210)*2 + 2;
      }else if(id === 221){
        tempScore = 22;
      }else{
        tempScore = 17;
        tempScore += (id%230)*9;
      }
      break;
  
    default:
      tempScore = 50 + Math.floor(Math.random() * 10);
      break;
  }
  return tempScore;
}

function whatDay(num){
  switch (num) {
    case 0:
      return "Sunday";      
      break;
    case 1:
      return "Monday";      
      break;
    case 2:
      return "Tuesday";      
      break;
    case 3:
      return "Wednesday";      
      break;
    case 4:
      return "Thursday";      
      break;
    case 5:
      return "Friday";      
      break;
    case 6:
      return "Saturday";      
      break;
  
    default:
      return "Error, day of week is different than 0-6"
      break;
  }
}
