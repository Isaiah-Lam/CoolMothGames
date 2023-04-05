var count = 0;
var turn = 1;
var winStreak = 0; 
var pop = new Audio("static/sounds/pop.mp3");

function clearBoard(){
    setTimeout(() => {
        $(".box").empty();
        $(".box").each(function(){
            $(this).removeClass("X");
            $(this).removeClass("O");
            $(this).addClass("empty");
            $(this).css("pointer-events" , "initial");
        })
    }, 1000);
    
}

function computerTurn(){
    pop.play();
    available = $(".box.empty");
    spot = available[Math.floor(Math.random() * available.length)];
    $(spot).text("O");
    $(spot).addClass("O");
    $(spot).removeClass("empty");
    $(spot).css("pointer-events", "none");
    turn = 1;
    if(checkWin("O")){
        winStreak = 0;
        $("#p2-score").text(p2Score);
        clearBoard();
    }
   
}



function checkWin(p){
    for(let i = 1; i<4; i++){
        let row = document.getElementsByClassName("row-" +i)[0];
        let boxes = row.getElementsByClassName("box");
        if($(boxes[0]).hasClass(p) && $(boxes[1]).hasClass(p) && $(boxes[2]).hasClass(p)){
            console.log("row")
            return p;
        }

    }
    for(let i=1; i<4; i++){
        let column = document.getElementsByClassName("col-"+i);
        if($(column[0]).hasClass(p) && $(column[1]).hasClass(p) && $(column[2]).hasClass(p)){
            console.log("col")
            return p;
        }
    }
    if($("#box-1").hasClass(p) && $("#box-5").hasClass(p) && $("#box-9").hasClass(p)){
        console.log("l-diag")
        return p;
    }
    else if($("#box-3").hasClass(p) && $("#box-5").hasClass(p) && $("#box-7").hasClass(p)){
        console.log("r-diag")
        return p;
    }
    return false;



}

function checkTie(){
    if($(".empty").length == 0){
        return true;
    }
    return false;
}

$(".box").click(function(){
    pop.play();
    $(this).text("X")
    $(this).addClass("X")
    $(this).removeClass("empty")
    $(this).css("pointer-events", "none");
    if(checkWin("X")){
        let form = document.createElement("form")
        $(form).attr("action", "/tictactoe")
        $(form).attr("method", "POST")
        document.getElementById("body").appendChild(form)
        $(form).submit()

    }
    else if(checkTie()){
        tie++;
        $("#ties").text(tie);
        clearBoard();

    }
    else {
        computerTurn();
    }
    
})

