var time = {
  hours: Number($("#hours").val()),
  minutes: Number($("#minutes").val()),
  seconds: Number($("#seconds").val()),
  onOff: $("#onOff").val(),
};

$(document).ready(function () {
  showNumbers();
});

var timer = setInterval(timerRun, 1000);
if (time.onOff === "false") {
  clearInterval(timer);
}

function timerRun() {
  if (time.seconds === 59) {
    if (time.minutes === 59) {
      time.minutes = 0;
      time.hours++;
    } else {
      time.seconds = 0;
      time.minutes++;
    }
  } else {
    time.seconds++;
  }
  showNumbers();
}
function showNumbers() {
  var hours, minutes, seconds;
  hours = time.hours;
  minutes = time.minutes;
  seconds = time.seconds;
  if (seconds.toString().length === 1) {
    seconds = addZero(seconds);
  }
  if (minutes.toString().length === 1) {
    minutes = addZero(minutes);
  }
  if (hours.toString().length === 1) {
    hours = addZero(hours);
  }
  $(".box2").text(hours + ":" + minutes + ":" + seconds);
}

function addZero(num) {
  return "0" + num.toString();
}

if ($(".box2").text().length <= 1 || $(".box2").text() === "00:00:00") {
  $(".box2").addClass("hidden");
} else {
  $(".box2").removeClass("hidden");
}

function checkBox() {
  if ($(".box2").text().length <= 1 || $(".box2").text() === "00:00:00") {
    $(".box2").addClass("hidden");
  } else {
    $(".box2").removeClass("hidden");
  }
}

function checkBox2() {
  if ($(".box2").hasClass("workOut")) {
    $(".box2").css({ top: "100%", "font-size": "2.3rem" });
  }
}

var timedChecks = setInterval(checkBox, 1000);
var firstCheck = setTimeout(checkBox, 10);
var firstCheck2 = setTimeout(checkBox2, 10);

$(document).keyup(function (event) {
  switch (event.code) {
    case "KeyZ":
      $("#home").click();
      location.href = "/";
      break;
    case "KeyX":
      location.href = "/gameWorkOut";
      break;
    case "KeyC":
      location.href = "/statistics";
      break;
    case "Backquote":
      location.href = "/settings";
      break;

    default:
      console.log("You didn't press a defined button!");
      break;
  }
});
