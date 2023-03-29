$(document).ready(function () {
    // $("#dealer-hand").append($("#top-card"));
    let deck = $("#deck").children();
    for (let i=0; i<deck.length; i++) {
        let j = Math.floor(Math.random()*deck.length);
        $(deck[i]).before(deck[j]);
    }
    // $("#deck").prepend($("#top-card"));
});

function startGame() {
    $($(".hand").get().reverse()).each(function () {
        $(this).append($("#deck").get(0).firstElementChild);
    });
    $("")
}