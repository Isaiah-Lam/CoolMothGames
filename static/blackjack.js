$(document).ready(function () {
    let deck = $("#deck").children();
    for (let i=0; i<deck.length; i++) {
        let j = Math.floor(Math.random()*deck.length);
        $(deck[i]).before(deck[j]);
    }
    playerTotal = 0;
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
    $('#player-hand').children('.card').each(function () {
        classList = $(".card").attr("class").split(/\s+/);
        playerTotal += parseInt(classList[3])
        console.log(classList);
    })
    // console.log(playerTotal);
}

function hit() {
    $($("#deck").get(0).firstElementChild).removeClass("facedown");
    classList = $(".card").attr("class").split(/\s+/);
    console.log(classList);
    $("#player-hand").append($("#deck").get(0).firstElementChild);
}

function checkBust() {

}