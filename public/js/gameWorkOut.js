$(document).keyup(function (event) {
  if (event.key > 0 && event.key < 10) {
    $("#mult" + event.key).prop("checked", "checked");
  }
  switch (event.code) {
    case "Space":
      $("#add").click();
      break;
    case "Backspace":
      $("#back").click();
      break;
    case "KeyR":
      $("#reset").click();
      break;
    case "KeyF":
      $("#session").click();
      break;

    default:
        console.log("You didn't press a defined button!");
      break;
  }
});

if($("#pressedStart").val() === "false" && $("#session").text() === "End Session!" && $("#pressedDelete").val() === "false"){
  $(".added").removeClass("invis");
}

let inBox = false;

$(document).click(function (event) {
  //The info popup click function using "inBox()".
  if (event.target.tagName === "I" && event.target.className.length === 27) {
    if (inBox === false) {
      infoBox("show");
    } else {
      infoBox("hide");
    }
  } else {
    if (inBox === true) {
      infoBox("hide");
    }
  }
});

function infoBox(onOff) {
  if (onOff === "show") {
    var soundName = new Audio("/sounds/sound3.mp3");
    soundName.play();
    $(".invisble-help").fadeIn(400);
    $(".invisble-help").addClass("brt");
    inBox = true;
  } else if (onOff === "hide") {
    $(".invisble-help").fadeOut(400);
    $(".invisble-help").removeClass("brt");
    inBox = false;
  }
}