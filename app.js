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
  names: {
    type: Array,
    required: true,
  },
  goals: {
    type: Array,
    required: true,
  },
  types: {
    type: Array,
    required: true,
  },
});
const Session = mongoose.model("Session", sessionSchema);

const statisticSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  },
});
const Statistic = mongoose.model("Statistic", statisticSchema);

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
  nextSeven: {
    type: Boolean,
    required: true,
  },
  testMode: {
    type: Boolean,
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
let errorType;

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
    errorType: errorType,
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
  Setting.findOne({}, function (err, foundSetting) {
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
app.get("/sessions", function (req, res) {
  if (startedTime > 0) {
    var time = date.bubble(startedTime);
  } else {
    var time = { hours: 0, minutes: 0, seconds: 0, onOff: false };
  }
  Session.find({}, function (err, foundSessions) {
    res.render("sessions", {
      sessions: foundSessions.reverse(),
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
  Statistic.find({}, function (err, foundStatistics) {
    res.render("statistics", {
      statistics: foundStatistics,
      hours: time.hours,
      minutes: time.minutes,
      seconds: time.seconds,
      onOff: time.onOff,
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
  Setting.findOne({}, function (err, foundSetting) {
    if (req.body.cityRadio === "other") {
      var city = req.body.cityName;
    } else {
      var city = req.body.cityRadio;
    }
    var query = "";
    city = city.split(" ");
    for (let i = 0; i < city.length; i++) {
      query =
        query + city[i].slice(0, 1).toUpperCase() + city[i].slice(1) + " ";
    }
    const apiKey = process.env.API_KEY;
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
        errorType = 0;
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
            console.log(
              "Getting weather status message- " + response.statusCode
            );

            response.on("data", function (data) {
              const weatherData = JSON.parse(data);
              firstDay = weatherData.daily[0].dt + "000";
              firstDay = Number(firstDay) + 25200000;
              firstDay = new Date(firstDay);
              if (foundSetting.nextSeven === false) {
                firstDay = firstDay.getDay(); //Checking what the first day that is being checked is, to make sure we get only the days that are still left in the week and not any extras.
              } else {
                firstDay = 0;
              }
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
      if (
        req.body.mult * foundSetting.exercises[0].perSet <
        foundSetting.exercises[0].maxRep
      ) {
        firstExer = req.body.mult * foundSetting.exercises[0].perSet;
      } else {
        firstExer = foundSetting.exercises[0].maxRep;
      }
      if (
        req.body.mult * foundSetting.exercises[1].perSet <
        foundSetting.exercises[1].maxRep
      ) {
        secondExer = req.body.mult * foundSetting.exercises[1].perSet;
      } else {
        secondExer = foundSetting.exercises[1].maxRep;
      }
      if (
        req.body.mult * foundSetting.exercises[2].perSet <
        foundSetting.exercises[2].maxRep
      ) {
        thirdExer = req.body.mult * foundSetting.exercises[2].perSet;
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
    Setting.findOne({}, function (err, foundSetting) {
      let goalsArray = [];
      let totalArray = [
        sports[sports.length - 1].firstEx,
        sports[sports.length - 1].secondEx,
        sports[sports.length - 1].thirdEx,
      ];
      let typesArray = [];
      for (let i = 0; i < totalArray.length; i++) {
        if (totalArray[i] >= foundSetting.exercises[i].goal) {
          goalsArray.push("green");
        } else {
          goalsArray.push("red");
        }
        if (foundSetting.exercises[i].type === "Seconds") {
          typesArray.push(foundSetting.exercises[i].type);
        } else {
          typesArray.push(null);
        }
      }
      const session = new Session({
        date: date.getDate(),
        reps: sports.length - emptyReps,
        emptyReps: emptyReps,
        timeDiff: 0,
        firstExercise: req.body.firstExercise,
        secondExercise: req.body.secondExercise,
        thirdExercise: req.body.thirdExercise,
        names: [
          req.body.exerciseName1,
          req.body.exerciseName2,
          req.body.exerciseName3,
        ],
        goals: goalsArray,
        types: typesArray,
      });
      endSession();
      session.timeDiff = date.convertTime(timeDiff);
      if (foundSetting.testMode === false) {
        let sumArray = [
          session.firstExercise,
          session.secondExercise,
          session.thirdExercise,
        ];
        for (let i = 0; i < sumArray.length; i++) {
          Statistic.findOne(
            { name: session.names[i] },
            function (err, foundStatistic) {
              if (!foundStatistic) {
                const statistic = new Statistic({
                  name: session.names[i],
                  total: sumArray[i],
                  type: typesArray[i],
                });
                statistic.save();
              } else {
                Statistic.findOneAndUpdate(
                  { name: session.names[i] },
                  {
                    $set: {
                      total: foundStatistic.total + sumArray[i],
                    },
                  },
                  function (err, foundSetting) {
                    if (!err) {
                      console.log("Updated statistic: " + foundSetting._id);
                    }
                  }
                );
                if (foundStatistic.type != typesArray[i]) {
                  Statistic.findOneAndUpdate(
                    { name: session.names[i] },
                    {
                      $set: {
                        type: typesArray[i],
                      },
                    },
                    function (err, foundSetting) {
                      if (!err) {
                        console.log("Updated statistic: " + foundSetting._id);
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
      session.save();
      sports = [firstSport];
      res.redirect("/gameWorkOut");
    });
  }
});

app.post("/deleteSession", function (req, res) {
  const sessionId = req.body.sessionId;
  Session.findByIdAndDelete(sessionId, function (err) {
    if (!err) {
      res.redirect("/sessions");
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
  if (req.body.action === "clearStatistics") {
    Statistic.remove
    Statistic.deleteMany({}, function(err, result){
      if(!err){
        console.log(result);
      }
    });
    res.redirect("/settings");
  } else {
    if (buttonText === "End Session!") {
      errorType = 1;
      res.redirect("/404");
    } else {
      Setting.findOne({}, function (err, foundSetting) {
        let checkBoxArray = [req.body.nextSeven, req.body.testMode];
        for (let t = 0; t < checkBoxArray.length; t++) {
          if (checkBoxArray[t] === "on") {
            checkBoxArray[t] = true;
          } else {
            checkBoxArray[t] = false;
          }
        }
        Setting.findOneAndUpdate(
          {},
          {
            $set: {
              firstCity: checkWho(
                foundSetting.firstCity,
                req.body.cityChoice1,
                0
              ),
              secondCity: checkWho(
                foundSetting.secondCity,
                req.body.cityChoice2,
                0
              ),
              nextSeven: checkBoxArray[0],
              testMode: checkBoxArray[1],
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
                "Updated exercise[0] information for setting: " +
                  foundSetting._id
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
                "Updated exercise[1] information for setting: " +
                  foundSetting._id
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
                "Updated exercise[2] information for setting: " +
                  foundSetting._id
              );
            }
          }
        );
      });
    }
  }
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
