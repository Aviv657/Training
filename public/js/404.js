let input = $("#weather-input").val();
switch (Number($("#error-type").val())) {
    case 0:
        console.log(Number($("#error-type").val()));
        $("#error-box").html("<h1 class='display-4'>uh oh!</h1><p class='lead'>It seems like there was a problem! <br />Make sure you have no typos and try again!</p><p>Your input was: " + input + " </p>");
        break;
    case 1:
        console.log(Number($("#error-type").val()));
        $("#error-box").html("<h1 class='display-4'>uh oh!</h1><p class='lead'>You can't change the settings while a session is running! <br>Go to game workout and finish your session!</p>");
        break;

    default:
        console.log("The actual value is " + Number($("#error-type").val()));
        break;
}