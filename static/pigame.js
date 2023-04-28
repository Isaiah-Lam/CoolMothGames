var pi = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989";
var score = 0;
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
var gameMode = "";
var timerActive = true;
var timerStarted = false;

$(document).ready(function () {
    $(".key").click(function () {
        if (!timerStarted) {
            stopwatch();
        }
        let input = $(this.firstElementChild).text();
        keyPress(input);
    });

    window.addEventListener('keydown', e => {
        if (keys.includes(e.key)) {
            if (!timerStarted) {
                stopwatch();
            }
            if (keyPress(e.key)) {
                $("#key"+e.key).addClass("pressed-correct");
            }
            else {
                $("#key"+e.key).addClass("pressed-wrong");
            }
        }
    });

    window.addEventListener('keyup', e => {
        if (keys.includes(e.key)) {
            $("#key"+e.key).removeClass("pressed-correct");
            $("#key"+e.key).removeClass("pressed-wrong");
        }
    });

});

function keyPress(input) {
    if (input == pi.substring(0,1)) {
        nextDigit(input);
        return true;
    }
    else {
        
    }
}

function nextDigit(num) {
    $("#end-digit-1").text($("#mid-digit-1").text());
    $("#mid-digit-1").text(num);
    score++;
    pi = pi.substring(1);
}

function endGame() {
    timerActive = false;
}

function showDesc(id) {
    $("#"+id+"-desc").css("display", "block");
}

function hideDesc(id) {
    $("#"+id+"-desc").css("display", "none");
}

function setupGame(mode) {
    $("#cover-div").css("display", "none");
    $("#start-div").css("display", "none");
    document.getElementById("digit-line").scrollIntoView();
    gameMode = mode;
}

function stopwatch() {
    timerStarted = true;
    if (timerActive) {
        let centiseconds = parseInt($("#centiseconds").text());
        let seconds = parseInt($("#seconds").text());
        centiseconds++;
        if (centiseconds == 100) {
            seconds++;
            if (seconds == 30) {
                timerActive = false;
            }
            centiseconds = 0;
        }
        centiseconds = ""+centiseconds;
        if (centiseconds < 10) {
            centiseconds = "0"+centiseconds;
        }
        seconds = ""+seconds;
        $("#centiseconds").text(centiseconds);
        $("#seconds").text(seconds);
        setTimeout(stopwatch, 10);
    }
}