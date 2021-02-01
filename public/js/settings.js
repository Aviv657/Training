for (let i = 1; i < 4; i++) {
    if($("#old-type" + i).val() === 'Number' ){
        $("#exer-type" + i).val('Number');
    }else{
        $("#exer-type" + i).val('Seconds');
    }
}

if($("#checkbox0").val() === "true"){
  console.log("checkbox0 should show as on");
  $("#checkOption0").prop("checked", "checked");
}else{
  console.log("checkbox0 should show as off");
}
console.log($("#checkbox1").val());
if($("#checkbox1").val() === "true"){
  console.log("checkbox1 should show as on");
  $("#checkOption1").prop("checked", "checked");
}else{
  console.log("checkbox1 should show as off");
}

$("body").keyup(function (event) {
    if(!$("input").is(":focus")){
      switch (event.key) {
        case " ":
          $("[value='changeSettings']").click();
          break;
        case "t":
          console.log("Pressed t!");
          if(!$("#checkOption1").prop("checked")){
            $("#checkOption1").prop("checked", "checked");
          }else{
            $("#checkOption1").prop("checked", "");

          }
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

