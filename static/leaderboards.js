function switchBoard(id) {
    id = parseInt(id);
    console.log(id);
    console.log($("#"+id));
    $(".leaderboard").css("display" , "none");
    if (id > 0) {
        $("#"+id).css("display", "block");
    }
    else {
        $(".leaderboard").css("display" , "initial");
    }
    // if (btn.innerHTML == "Reset Filter") {
    //     
    // }
    // if (btn.innerHTML == "Memory") {
    //     $(".leaderboard").css("display" , "none");
    //     $("#1").css("display", "initial");
    // }
    // if (btn.innerHTML == "Minesweeper") {
    //     $(".leaderboard").css("display" , "none");
    //     $("#4").css("display", "initial");
    // }
    // if (btn.innerHTML == "Rock, Paper, Scissors") {
    //     $(".leaderboard").css("display" , "none");
    //     $("#2").css("display", "initial");
    // }
    // if (btn.innerHTML == "Tic Tac Toe") {
    //     $(".leaderboard").css("display" , "none");
    //     $("#3").css("display", "initial");
    // }
}