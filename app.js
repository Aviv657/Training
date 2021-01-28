const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { query } = require("express");
const { time } = require("console");
const { settings } = require("cluster");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://aviv:test123@cluster0.l3wmw.mongodb.net/training",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const sessionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  emptyReps: {
    type: Number,
    required: true,
  },
  timeDiff: {
    type: String,
    required: true,
  },
  firstExercise: {
    type: Number,
    required: true,
  },
  secondExercise: {
    type: Number,
    required: true,
  },
  thirdExercise: {
    type: Number,
    required: true,
  },
});
const Session = mongoose.model("Session", sessionSchema);

const exerciseSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true,
  },
  perSet: {
    type: Number,
    required: true,
  },
  maxRep: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
  },
});
const Exercise = mongoose.model("Exercise", exerciseSchema);

const settingSchema = new mongoose.Schema({
  firstCity: {
    type: String,
    required: true,
  },
  secondCity: {
    type: String,
    required: true,
  },
  exercises: {
    type: [exerciseSchema],
    required: true,
  },
});
const Setting = mongoose.model("Setting", settingSchema);

let input;
let daysArray = [];
let firstDay;
let cityName;
let unitShow = "celsius";
let firstSport = {
  firstEx: 0,
  secondEx: 0,
  thirdEx: 0,
};
let sports = [firstSport];
let buttonText = "Start Session!";
let startedTime = 0;
let timeDiff;
let emptyReps = 0;
let pressedStart = false;
let pressedDelete = false;
let firstExer = 0;
let secondExer = 0;
let thirdExer = 0;

app.get("/", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  Setting.findOne({}, function (err, foundSetting) {
    res.render("index", {
      firstCity: foundSetting.firstCity,
      secondCity: foundSetting.secondCity,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
      onOff: time.onOff,
    });
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
  setTimeout(function () {
    pressedDelete = false;
  }, 500);
  Setting.findOne({}, function(err, foundSetting){
    res.render("gameWorkOut", {
      setting: foundSetting,
      firstExer: firstExer,
      secondExer: secondExer,
      thirdExer: thirdExer,
      totalFirstExer: sports[sports.length - 1].firstEx,
      totalSecondExer: sports[sports.length - 1].secondEx,
      totalThirdExer: sports[sports.length - 1].thirdEx,
      pressedStart: pressedStart,
      pressedDelete: pressedDelete,
      sessionButton: buttonText,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
      onOff: time.onOff,
    });
  });
});
app.get("/statistics", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  Session.find({}, function (err, foundSessions) {
    Setting.findOne({}, function (err, foundSetting) {
      res.render("statistics", {
        setting: foundSetting,
        sessions: foundSessions.reverse(),
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
        onOff: time.onOff,
      });
    });
  });
});
app.get("/settings", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  Setting.find({}, function (err, foundSettings) {
    res.render("settings", {
      settings: foundSettings,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
      onOff: time.onOff,
    });
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
  Setting.findOne({}, function (err, foundSetting) {
    if (req.body.action === "add") {
      if (req.body.mult*foundSetting.exercises[0].perSet < foundSetting.exercises[0].maxRep) {
        firstExer = req.body.mult*foundSetting.exercises[0].perSet;
      } else {
        firstExer = foundSetting.exercises[0].maxRep;
      }
      if (req.body.mult*foundSetting.exercises[1].perSet < foundSetting.exercises[1].maxRep) {
        secondExer = req.body.mult*foundSetting.exercises[1].perSet;
      } else {
        secondExer = foundSetting.exercises[1].maxRep;
      }
      if (req.body.mult*foundSetting.exercises[2].perSet < foundSetting.exercises[2].maxRep) {
        thirdExer = req.body.mult*foundSetting.exercises[2].perSet;
      } else {
        thirdExer = foundSetting.exercises[2].maxRep;
      }
      let newSport = {
        firstEx: sports[sports.length - 1].firstEx + firstExer,
        secondEx: sports[sports.length - 1].secondEx + secondExer,
        thirdEx: sports[sports.length - 1].thirdEx + thirdExer,
      };
      if (pressedStart === true) {
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
      firstExer = 100000;
      console.log("Something broke!");
    }
    res.redirect("/gameWorkOut");
  });
});

app.post("/addSession", function (req, res) {
  if (buttonText === "Start Session!") {
    startSession();
    pressedStart = true;
    res.redirect("/gameWorkOut");
  } else {
    if (pressedStart === true) {
      sports.pop();
    }
    let statistic = {
      date: date.getDate(),
      reps: sports.length - emptyReps,
      emptyReps: emptyReps,
      timeDiff: 0,
      firstExercise: req.body.firstExercise,
      secondExercise: req.body.secondExercise,
      thirdExercise: req.body.thirdExercise,
    };
    endSession();
    statistic.timeDiff = date.convertTime(timeDiff);
    const session = new Session({
      date: statistic.date,
      reps: statistic.reps,
      emptyReps: statistic.emptyReps,
      timeDiff: statistic.timeDiff,
      firstExercise: statistic.firstExercise,
      secondExercise: statistic.secondExercise,
      thirdExercise: statistic.thirdExercise,
    });
    session.save();
    sports = [firstSport];
    res.redirect("/gameWorkOut");
  }
});

app.post("/deleteSession", function (req, res) {
  const sessionId = req.body.sessionId;
  Session.findByIdAndDelete(sessionId, function (err) {
    if (!err) {
      res.redirect("/statistics");
    }
  });
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
  firstExer = 0;
  secondExer = 0;
  thirdExer = 0;
}

app.post("/updateSettings", function (req, res) {
  Setting.findOne({}, function (err, foundSetting) {
    Setting.findOneAndUpdate(
      {},
      {
        $set: {
          firstCity: checkWho(foundSetting.firstCity, req.body.cityChoice1, 0),
          secondCity: checkWho(
            foundSetting.secondCity,
            req.body.cityChoice2,
            0
          ),
        },
      },
      function (err, foundSetting) {
        if (!err) {
          console.log(
            "Updated global information for setting: " + foundSetting._id
          );
        }
      }
    );
    Setting.findOneAndUpdate(
      {
        _id: foundSetting._id,
        "exercises.exerciseName": foundSetting.exercises[0].exerciseName,
      },
      {
        $set: {
          "exercises.$.exerciseName": checkWho(
            foundSetting.exercises[0].exerciseName,
            req.body.exerName1,
            0
          ),
          "exercises.$.perSet": checkWho(
            foundSetting.exercises[0].perSet,
            req.body.exerSet1,
            1
          ),
          "exercises.$.maxRep": checkWho(
            foundSetting.exercises[0].maxRep,
            req.body.exerMaxRep1,
            1
          ),
          "exercises.$.type": req.body.exerType1,
          "exercises.$.goal": checkWho(
            foundSetting.exercises[0].goal,
            req.body.exerGoal1,
            1
          ),
        },
      },
      function (err, foundSettings) {
        if (!err) {
          console.log(
            "Updated exercise[0] information for setting: " + foundSetting._id
          );
        }
      }
    );
    Setting.findOneAndUpdate(
      {
        _id: foundSetting._id,
        "exercises.exerciseName": foundSetting.exercises[1].exerciseName,
      },
      {
        $set: {
          "exercises.$.exerciseName": checkWho(
            foundSetting.exercises[1].exerciseName,
            req.body.exerName2,
            0
          ),
          "exercises.$.perSet": checkWho(
            foundSetting.exercises[1].perSet,
            req.body.exerSet2,
            1
          ),
          "exercises.$.maxRep": checkWho(
            foundSetting.exercises[1].maxRep,
            req.body.exerMaxRep2,
            1
          ),
          "exercises.$.type": req.body.exerType2,
          "exercises.$.goal": checkWho(
            foundSetting.exercises[1].goal,
            req.body.exerGoal2,
            1
          ),
        },
      },
      function (err, foundSettings) {
        if (!err) {
          console.log(
            "Updated exercise[1] information for setting: " + foundSetting._id
          );
        }
      }
    );
    Setting.findOneAndUpdate(
      {
        _id: foundSetting._id,
        "exercises.exerciseName": foundSetting.exercises[2].exerciseName,
      },
      {
        $set: {
          "exercises.$.exerciseName": checkWho(
            foundSetting.exercises[2].exerciseName,
            req.body.exerName3,
            0
          ),
          "exercises.$.perSet": checkWho(
            foundSetting.exercises[2].perSet,
            req.body.exerSet3,
            1
          ),
          "exercises.$.maxRep": checkWho(
            foundSetting.exercises[2].maxRep,
            req.body.exerMaxRep3,
            1
          ),
          "exercises.$.type": req.body.exerType3,
          "exercises.$.goal": checkWho(
            foundSetting.exercises[2].goal,
            req.body.exerGoal3,
            1
          ),
        },
      },
      function (err, foundSettings) {
        if (!err) {
          res.redirect("/settings");
          console.log(
            "Updated exercise[2] information for setting: " + foundSetting._id
          );
        }
      }
    );
  });
});

function checkWho(oldData, newData, keyWord) {
  switch (keyWord) {
    case 0:
      if (newData.length < 1) {
        return oldData;
      } else {
        return newData;
      }
      break;
    case 1:
      if (newData.length < 1 || newData < 1) {
        return oldData;
      } else {
        return newData;
      }
      break;

    default:
      console.log(
        "Somehow you activated chechWho() with a keyWord not available!"
      );
      break;
  }
}

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});

// const exercise1 = new Exercise({
//   exerciseName: "Push-Ups",
//   perSet: 4,
//   maxRep: 25,
//   type: "Number",
//   goal: 120,
// });
// exercise1.save();
// const exercise2 = new Exercise({
//   exerciseName: "Sit-Ups",
//   perSet: 24,
//   maxRep: 150,
//   type: "Number",
//   goal: 750,
// });
// exercise2.save();
// const exercise3 = new Exercise({
//   exerciseName: "Squats",
//   perSet: 8,
//   maxRep: 20,
//   type: "Number",
//   goal: 240,
// });
// exercise3.save();
// Exercise.find({}, function (err, foundExercises) {
//   console.log(foundExercises[0]);
//   const tempSetting = new Setting({
//     firstCity: "Ramat Gan",
//     secondCity: "Tel Aviv",
//     exercises: [foundExercises[0], foundExercises[1], foundExercises[2]]
//   });
//   tempSetting.save();
// });
