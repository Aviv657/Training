
$("body").keyup(function (event) {
  if(!$("input").is(":focus")){
    switch (event.key) {
      case "1":
        $("#cityChoice1").prop("checked", "checked");
        $("#cityInput").blur();
        break;
      case "2":
        $("#cityChoice2").prop("checked", "checked");
        $("#cityInput").blur();
        break;
      case "3":
        $("#cityChoice3").prop("checked", "checked");
        $("#cityInput").focus();
        break;
      case " ":
        $("#show").click();
        break;
  
      default:
        console.log("You didn't press a defined button!");
        break;
    }
  }
});

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