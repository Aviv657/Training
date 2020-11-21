const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");
const { query } = require("express");
const { time } = require("console");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
let input;
let daysArray = [];
let firstDay;
let cityName;
let unitShow = "celsius";
let firstSport = {
  pushUps: 0,
  sitUps: 0,
  squats: 0,
};
let sports = [firstSport];
let registeredSessions = [];
let buttonText = "Start Session!";
let startedTime = 0;
let timeDiff;
let emptyReps = 0;
let pressedStart = false;
let pressedDelete = false;
let thisPushUps = 0;
let thisSitUps = 0;
let thisSquats = 0;

app.get("/", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  res.render("index", {
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    onOff: time.onOff,
  });
});
app.get("/weather", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  res.render("weather", {
    daysArray: daysArray,
    cityName: cityName,
    firstDay: firstDay,
    unit: unitShow,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    onOff: time.onOff,
  });
});
app.get("/404", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  res.render("404", {
    input: input,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    onOff: time.onOff,
  });
});
app.get("/gameWorkOut", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  setTimeout(function(){pressedDelete = false}, 500);
  res.render("gameWorkOut", {
    pushUps: thisPushUps,
    sitUps: thisSitUps,
    squats: thisSquats,
    PTotalPushUps: sports[sports.length - 1].pushUps,
    PTotalSitUps: sports[sports.length - 1].sitUps,
    PTotalSquats: sports[sports.length - 1].squats,
    pressedStart: pressedStart,
    pressedDelete: pressedDelete,
    sessionButton: buttonText,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    onOff: time.onOff,
  })
});
app.get("/statistics", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  res.render("statistics", {
    sessions: registeredSessions,
    hours: time.hours,
    minutes: time.minutes,
    seconds: time.seconds,
    onOff: time.onOff,
  });
});

app.post("/", function (req, res) {
  if (req.body.cityRadio === "other") {
    var city = req.body.cityName;
  } else {
    var city = req.body.cityRadio;
  }
  var query = "";
  city = city.split(" ");
  for (let i = 0; i < city.length; i++) {
    query = query + city[i].slice(0, 1).toUpperCase() + city[i].slice(1) + " ";
  }
  const apiKey = "9a2a39a6da819de9b03d156235494b78";
  const unit = req.body.unitType;
  if (unit === "metric") {
    unitShow = "celsius";
  } else if (unit === "imperial") {
    unitShow = "fahrenheit";
  } else {
    unitShow = "kelvin";
  }
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    console.log("Getting location status message- " + response.statusCode);
    if (response.statusCode === 404) {
      input = query;
      res.redirect("/404");
    } else {
      response.on("data", function (data) {
        const locationData = JSON.parse(data);
        const location = {
          lon: locationData.coord.lon,
          lat: locationData.coord.lat,
        };
        const url2 =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          location.lat +
          "&lon=" +
          location.lon +
          "&exclude=current,minutely,hourly,alerts&units=" +
          unit +
          "&appid=" +
          apiKey;
        https.get(url2, function (response) {
          console.log("Getting weather status message- " + response.statusCode);

          response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            firstDay = weatherData.daily[0].dt + "000";
            firstDay = Number(firstDay) + 25200000;
            firstDay = new Date(firstDay);
            firstDay = firstDay.getDay(); //Checking what the first day that is being checked is, to make sure we get only the days that are still left in the week and not any extras.
            for (let i = 0; i < 7 - firstDay; i++) {
              //Creating an array of objects with all the info for each day of the week till saturday.
              daysArray[i] = {
                dayOfWeek: date.whatDay(i + firstDay),
                temp: weatherData.daily[i].temp.eve,
                descId: weatherData.daily[i].weather[0].id,
                mainDesc: weatherData.daily[i].weather[0].main,
                desc: weatherData.daily[i].weather[0].description,
                iconAdress:
                  "http://openweathermap.org/img/wn/" +
                  weatherData.daily[i].weather[0].icon +
                  "@2x.png",
                score: 0,
              };
              daysArray[i].score = calcScore(
                daysArray[i].temp,
                daysArray[i].mainDesc,
                daysArray[i].descId
              ); //Calculating the score for each day.
            }
            daysArray.sort(function (a, b) {
              return a.score - b.score;
            });
            cityName = query;
            res.redirect("/weather");
          });
        });
      });
    }
  });
});

function calcScore(temp, mainDesc, id) {
  var tempScore;
  switch (mainDesc) {
    case "Clear":
      tempScore = 0;
      if (temp >= 30 && temp <= 35) {
        tempScore += 8;
      } else if (temp > 35) {
        tempScore += 15;
      }
      break;
    case "Clouds":
      if (id > 802) {
        tempScore = 3;
        if (temp >= 30 && temp <= 35) {
          tempScore += 8;
        } else if (temp > 35) {
          tempScore += 15;
        }
      } else {
        tempScore = 5;
        tempScore += (id % 800) * 3;
      }
      break;
    case "Snow":
      if (id < 603 && id > 599) {
        tempScore = 12;
        tempScore += (id % 600) * 3;
      } else if (id > 610 && id < 614) {
        tempScore = 17;
        tempScore += id % 600;
      } else if (id === 615 || id === 616) {
        tempScore = 13;
        tempScore += (id % 600) + (id % 615) * 2;
      } else {
        tempScore = 24;
        tempScore += (id % 619) * 5;
      }
      break;
    case "Drizzle":
      tempScore = 15;
      if (id < 303) {
        tempScore += (id % 300) * 9;
      } else {
        tempScore += id % 300;
      }
      break;
    case "Rain":
      if (id < 505) {
        tempScore = 22;
        tempScore += (id % 500) * 4;
      } else if (id === 511) {
        tempScore = 52;
      } else {
        tempScore = 6;
        tempScore += id % 500;
      }
      break;
    case "Thunderstorm":
      if (id < 203) {
        tempScore = 22;
        tempScore += (id % 200) * 5;
      } else if (id > 203 && id < 213) {
        tempScore = 14;
        tempScore += (id % 210) * 2 + 2;
      } else if (id === 221) {
        tempScore = 22;
      } else {
        tempScore = 17;
        tempScore += (id % 230) * 9;
      }
      break;

    default:
      tempScore = 50 + Math.floor(Math.random() * 10);
      break;
  }
  return tempScore;
}

app.post("/gameWorkOut", function (req, res) {
  if (req.body.action === "add") {
    let whichSquats;
    if (req.body.mult >= 3) {
      whichSquats = 20;
    } else {
      whichSquats = req.body.mult * 8;
    }
    thisPushUps = req.body.mult * 4;
    thisSitUps = req.body.mult * 24;
    thisSquats = whichSquats;
    let newSport = {
      pushUps: sports[sports.length - 1].pushUps + thisPushUps,
      sitUps: sports[sports.length - 1].sitUps + thisSitUps,
      squats: sports[sports.length - 1].squats + thisSquats,
    };
    if(pressedStart === true){
      sports.pop();
      pressedStart = false;
    }
    if (Number(req.body.mult) === 0) {
      emptyReps++;
    }
    if (buttonText === "Start Session!") {
      sports.pop();
      startSession();
    }
    sports.push(newSport);
  } else if (req.body.action === "back") {
    if (sports.length > 1) {
      sports.pop();
    } else {
      sports = [firstSport];
    }
    pressedDelete = true;
  } else if (req.body.action === "reset") {
    sports = [firstSport];
    endSession();
  } else {
    pushUps = 100000;
    console.log("Something broke!");
  }
  res.redirect("/gameWorkOut");
});

app.post("/addStatistics", function (req, res) {
  if (buttonText === "Start Session!") {
    startSession();
    pressedStart = true;
    res.redirect("/gameWorkOut");
  } else {
    if(pressedStart === true){
      sports.pop();
    }
    let statistic = {
      date: date.getDate(),
      reps: sports.length - emptyReps,
      emptyReps: emptyReps,
      timeDiff: 0,
      pushUps: req.body.sessionPushUps,
      sitUps: req.body.sessionSitUps,
      squats: req.body.sessionSquats,
    };
    endSession();
    statistic.timeDiff = date.convertTime(timeDiff);
    registeredSessions.push(statistic);
    sports = [firstSport];
    res.redirect("/gameWorkOut");
  }
});

function startSession() {
  buttonText = "End Session!";
  startedTime = date.thisTime();
}

function endSession() {
  buttonText = "Start Session!";
  timeDiff = date.calcDiff(startedTime);
  startedTime = 0;
  emptyReps = 0;
  pressedStart = false;
  firstRep = true;
  thisPushUps = 0;
  thisSitUps = 0;
  thisSquats = 0;
}

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is up and running on port 3000!");
});
