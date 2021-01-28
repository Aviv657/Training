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

for (let i = 1; i < 4; i++) {
  if($("#type" + i).val() === "Seconds"){
    $("#plus" + i).text($("#plus" + i).text() + " Seconds");
    $("#sum" + i).text($("#sum" + i).text() + " Seconds");
  }
  calcStage($("#sum" + i) ,Number($("#totalEx" + i).val()), Number($("#goal" + i).val()));
}

function calcStage(target, current, goal){
  let cuts = goal/5;
  switch (true) {
    case cuts >= current:
      $(target).css( "color", "#000000" );
      break;
    case cuts*2 >= current && cuts < current:
      $(target).css( "color", "#3b4d49" );
      break;
    case cuts*3 >= current && cuts*2 < current:
      $(target).css( "color", "#40665e" );
      break;
    case cuts*4 >= current && cuts*3 < current:
      $(target).css( "color", "#397a6d" );
      break;
    case goal > current && cuts*4 < current:
      $(target).css( "color", "#279680" );
      break;
    case goal <= current:
      $(target).css( "color", "#1abc9c" );
      $(target).text($(target).text() + "✓");
      break;
  
    default:
      return "cut is " + cuts + " figure out where it broke.";
      break;
  }
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