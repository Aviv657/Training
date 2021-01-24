exports.whatDay = function whatDay(num) {
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
      return "Error, day of week is different than 0-6";
      break;
  }
};

exports.getDate = function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return today.toLocaleDateString("en-US", options);
};

exports.thisTime = function thisTime() {
  var d = new Date();
  var n = d.getTime();
  return n;
};

exports.calcDiff = function calcDiff(preTime) {
  var d = new Date();
  var d = d.getTime();
  var a = d - preTime;
  a = a / 1000;
  return a;
};

exports.convertTime = function convertTime(time) {
  var newTime = Math.round(time);
  var hours = "hours";
  var minutes = "minutes";
  var seconds = "seconds";
  if (newTime <= 7200) {
    hours = "hour";
  }
  if (newTime <= 60) {
    //Seconds text format.
    if (newTime === 1) {
      seconds = "second";
    }
    return newTime + " " + seconds;
  } else if (newTime > 60 && newTime <= 3600) {
    //Minutes + seconds format.
    if (newTime / 60 === 1) {
      minutes = "minute";
    }
    if (newTime % 60 === 1) {
      seconds = "second";
    }
    return (
      Math.round(newTime / 60) +
      " " +
      minutes +
      " and ㅤㅤㅤㅤㅤ" +
      (newTime % 60) +
      " " +
      seconds
    );
  } else {
    //Hours and minutes format.
    if (newTime % 3600 === 1) {
      minutes = "minute";
    }
    return (
      Math.round(newTime / 3600) +
      " " +
      hours +
      " and ㅤㅤㅤㅤㅤ" +
      Math.round((newTime % 3600)/60) +
      " " +
      minutes
    );
  }
};

exports.bubble = function bubble(preTime) {
  if (preTime === 0) {
    return;
  } else {
    var d = new Date();
    var d = d.getTime();
    var a = d - preTime;
    a = Math.round(a / 1000);
    var time, hours, minutes, seconds;
    hours = a / 3600;
    minutes = a / 60;
    seconds = a % 60;
    if (hours > 0) {
      minutes = (a % 3600) / 60;
      seconds = (a % 3600) % 60;
    }
    time = {
      hours: Math.floor(hours),
      minutes: Math.floor(minutes),
      seconds: Math.floor(seconds),
      onOff: true,
    }
    return time;
  }
};
