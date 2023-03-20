function switchBoard(btn) {
    if (btn.innerHTML == "Reset Filter") {
        $(".leaderboard").css("display" , "initial");
    }
    if (btn.innerHTML == "Memory") {
        $(".leaderboard").css("display" , "none");
        $("#1").css("display", "initial");
    }
    if (btn.innerHTML == "Minesweeper") {
        $(".leaderboard").css("display" , "none");
        $("#4").css("display", "initial");
    }
    if (btn.innerHTML == "Rock, Paper, Scissors") {
        $(".leaderboard").css("display" , "none");
        $("#2").css("display", "initial");
    }
    if (btn.innerHTML == "Tic Tac Toe") {
        $(".leaderboard").css("display" , "none");
        $("#3").css("display", "initial");
    }
}