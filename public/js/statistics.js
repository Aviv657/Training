for (let i = 1; i < 4; i++) {
  if ($(".goal" + i).val() === "true") {
    $(".exer" + i).css("color", "#1abc9c");
  }
}

$(document).keyup(function (event) {
  if (event.code === "KeyS") {
    if ($("h1").text() === "Sessions") {
      location.href = "/statistics";
    } else {
      location.href = "/sessions";
    }
  } else {
    console.log("im inside a text box bittcchhhh");
  }
});

let inBox = false;

$(document).click(function (event) {
  var thisNum = event.target.className.split(" ");
  var thisClass = thisNum[1];
  thisNum = convertToNum(thisNum[0]);
  var thisDate = $(".session-date" + thisNum).text();
  var thisId = $("#session-id" + thisNum).val();
  if (thisClass === "delete") {
    if (inBox === false) {
        console.log("Extracted values- " + "thisDate: " + thisDate + "thisId: " + thisId);
      $(".invisble-help").html('<h1 style="color: yellow;">Delete Session</h1><p style="font-size: 2rem;">You are about to delete a session made on "' + thisDate + '"<p style="font-size: 2.5rem;">Are you sure?</p><br><br><form action="/deleteSession" method="POST"><input type="hidden" name="sessionId" value="' + thisId +'"><button class="btn-dl sp" type="submit">✓</button><i class="btn-sp sp">🗙</i></form>');
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


function convertToNum(text) {
  var number = "";
  for (let i = 0; i < text.length; i++) {
    if (!isNaN(text.slice(i, i + 1))) {
      number += text.slice(i, i + 1);
    }
  }
  return Number(number);
}

