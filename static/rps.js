var playerMove = ""
var compMove = ""
playerScore = 0
compScore = 0

function compChoice(){
    var choice = Math.floor(Math.random()*3) + 1;
    console.log(choice);
    if (choice === 1) {
        compMove = "rock"
        $(".box2").append("✊");
    }
    else if (choice === 2) {
        compMove = "paper"
        $(".box2").append("✋");
    }
    else {
        compMove = "scissors"
        $(".box2").append("✌️");
    }
    console.log(`Computer move is ${compMove}`);
}

function checkWinner() {
    if (playerMove === "rock" && compMove === "rock"){
        $(".win-or-lose").text("Tie"); 
    }
    else if (playerMove === "rock" && compMove === "scissors") {
        playerScore += 1
        $("#p-score").text(`${playerScore}`);
        $(".win-or-lose").text("Player Wins!");
    }
    else if (playerMove === "rock" && compMove === "paper"){
        compScore += 1
        $("#c-score").text(`${compScore}`);
        $(".win-or-lose").text("Moth-man wins");
    }
    else if (playerMove === "paper" && compMove === "rock"){
        playerScore += 1
        $("#p-score").text(`${playerScore}`);
        $(".win-or-lose").text("Player Wins!");
    }
    else if (playerMove === "paper" && compMove === "paper"){
        $(".win-or-lose").text("Tie");
    }
    else if (playerMove === "paper" && compMove === "scissors"){
        compScore += 1
        $("#c-score").text(`${compScore}`);
        $(".win-or-lose").text("Moth-man wins");
    }
    else if (playerMove === "scissors" && compMove === "rock"){
        compScore += 1
        $("#c-score").text(`${compScore}`);
        $(".win-or-lose").text("Moth-man wins");
    }
    else if (playerMove === "scissors" && compMove === "paper"){
        playerScore += 1
        $("#p-score").text(`${playerScore}`);
        $(".win-or-lose").text("Player Wins!");
    }
    else if (playerMove === "scissors" && compMove === "scissors"){
        $(".win-or-lose").text("Tie");
    }
    $(".playerChoice").removeClass("playerChoice");
}

function clear() {
    $(".box1").empty()
    $(".box2").empty()
}

function finalScore() {
    if (compScore > 0 && playerScore == 0) {
        compScore = 0;
    }
    if (compScore > 0 && playerScore >= 1) {
        form = document.createElement("form");
        $(document.body).append(form);
        $(form).attr("action", "/rps");
        $(form).attr("method", "POST");
        input = document.createElement("input");
        $(input).attr("name", "score");
        $(input).val(playerScore);
        $(form).append(input);
        $(form).submit();
    }
}

$(".emoji-big").click(function(){
    clear()
     $(this).addClass("playerChoice");
     if($("#rock").hasClass("playerChoice")) {
         playerMove = "rock"
         $(".box1").append("✊");
     }
     else if($("#paper").hasClass("playerChoice")) {
        playerMove = "paper"
        $(".box1").append("✋");
    }
     else {
        playerMove = "scissors"
        $(".box1").append("✌️");
    }
     console.log(`Player move is ${playerMove}`)
     compChoice();
     checkWinner();
     finalScore();
})