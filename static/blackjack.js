$(document).ready(function () {
    let deck = $("#deck").children();
    for (let i=0; i<deck.length; i++) {
        let j = Math.floor(Math.random()*deck.length);
        $(deck[i]).before(deck[j]);
    }
    playerTotal = 0;
    dealerTotal = 0;
    playerTotal2 = 0;
    dealerTotal2 = 0;
    startGame();
});

function startGame() {
    $("#dealer-hand").append($("#deck").get(0).firstElementChild);
    $($("#deck").get(0).firstElementChild).removeClass("facedown");
    $("#player-hand").append($("#deck").get(0).firstElementChild);
    $($(".hand").get().reverse()).each(function () {
        $($("#deck").get(0).firstElementChild).removeClass("facedown");
        $(this).append($("#deck").get(0).firstElementChild);
    });
    $("#start-btn").css("display" , "none");
    $("#hit-btn").css("display", "block");
    $("#stand-btn").css("display", "block");
    $('#player-hand').children('.card').each(function () {
        classList = $(this).attr("class").split(/\s+/);
        playerTotal += parseInt(classList[3])
        // console.log(classList);
    })
    $('#dealer-hand').children('.card').each(function () {
        classList = $(this).attr("class").split(/\s+/);
        dealerTotal += parseInt(classList[3]);
        // console.log(classList);
    })
    // console.log("Player Total = " + playerTotal);
    // console.log("Dealer Total = "  + dealerTotal);
}

function hit() {
    $($("#deck").get(0).firstElementChild).removeClass("facedown");
    classList = $(".card").attr("class").split(/\s+/);
    playerTotal += parseInt(classList[3])
    console.log(playerTotal);
    $("#player-hand").append($("#deck").get(0).firstElementChild);
    if (checkBust(playerTotal, "#player-hand")) {
        // location.reload();
        console.log("Player Lost");
        endGame();
    }
    document.getElementById("player-hand").scrollIntoView();
}

function checkBust(total, side) {
    $(side).children('.card').each(function () {
        classList = $(this).attr("class").split(/\s+/);
        if (classList[1] == "A") {
            if (side == "#player-hand") {
                playerTotal2 = total - 10;
            }
            else {
                dealerTotal2 = total - 10;
            }
        }
        else {
            if (side == "#player-hand") {
                playerTotal2 = total;
            }
            else {
                dealerTotal2 = total;
            }
        }
    })
    if (side == "#player-hand") {
        if (playerTotal2 > 21) {
            winner = "Dealer Wins"
            return true;
        }
        else{return false;}
    }
    else {
        if (dealerTotal2 > 21) { return true;}
        else{return false;}
     }
    }




function dealerTurn() {
    if (playerTotal2 == 0) {
        playerTotal2 = playerTotal;
    }
    $($("#dealer-hand").get(0).firstElementChild).removeClass("facedown");
    while (dealerTotal <= 16) {
        $($("#deck").get(0).firstElementChild).removeClass("facedown");
        classList = $(".card").attr("class").split(/\s+/);
        dealerTotal += parseInt(classList[3]);
        $("#dealer-hand").append($("#deck").get(0).firstElementChild);
        // console.log(dealerTotal);
    }
    if (checkBust(dealerTotal, "#dealer-hand")) {
        console.log("Player Wins");
        winner = "Player Wins";
    }
    else if (playerTotal2 > dealerTotal2) {
        console.log("Player Wins");
        winner = "Player Wins";
    }
    else if (playerTotal2 < dealerTotal2) {
        console.log("Dealer Wins");
        winner = "Dealer Wins";
    }
    else {
        console.log("Tie");
        winner = "Tie";
    }
    endGame();
}

function endGame() {
    $("#new-hand").css("display", "block");
    $("#hit-btn").css("display", "none");
    $("#stand-btn").css("display", "none");
    console.log("Player Total = "+playerTotal2);
    console.log("Dealer Total = "+dealerTotal2);
    var winnerText = $("<p></p>").text(winner);
    $(".winner-box").append(winnerText);
}

function newHand() {
    location.reload();
}