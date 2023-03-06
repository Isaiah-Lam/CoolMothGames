var p1Score = 0;
var p2Score = 0;
var tie = 0;
var count = 0;
var turn = 1;

var pop = new Audio("pop.mp3");




function clearBoard(){
    $(".box").empty()
    $(".box").each(function(){
        $(this).css("pointer-events" , "initial")
    })
}





function checkWinX(){
    if( $(".row-1 .X").length === 3 || $(".row-2 .box.X").length === 3 
    || $(".row-3 .box.X").length === 3 || $(".col-1 .box.X").length === 3 ||
    $(".col-1.X").length === 3 || $(".col-2.X").length === 3 || $(".col-3.X").length === 3 ||
    $("#box-1").hasClass("X") && $("#box-5").hasClass("X") && $("#box-9").hasClass("X") || 
    $("#box-3").hasClass("X") && $("#box-5").hasClass("X") && $("#box-7").hasClass("X")){
        return true; 
    }
}
function checkWinO(){
   if($(".row-1 .O").length === 3 || $(".row-2 .box.O").length === 3 
    || $(".row-3 .box.O").length === 3 ||
    $(".col-1.O").length === 3 || $(".col-2.O").length === 3 || $(".col-3.O").length === 3 ||
    $("#box-1").hasClass("O") && $("#box-5").hasClass("O") && $("#box-9").hasClass("O") || 
    $("#box-3").hasClass("O") && $("#box-5").hasClass("O") && $("#box-7").hasClass("O")){
    return true; 
    }
}


$(".box").click(function(){
   
    pop.play();

        if(turn === 1 && count < 9){
            $(this).text("X")
            $(this).addClass("X")
            $(this).css("pointer-events" ,"none")
            count++
            turn = 2;
            console.log(count)
            $("#turn").text("Turn: Player-2")
            if(checkWinX()){
                p1Score++
                count = 0
                $("#p1-score").text(p1Score)
                clearBoard();
                $(".box").removeClass("X O")
            }
            else if(count === 9){
                tie++; 
                $("#ties").text(tie)
                clearBoard();
                count = 0;
                console.log(tie)
                console.log(count)
                $(".box").removeClass("X O")
            }
        
    }
    else
    {
        $(this).text("O")
        $(this).addClass("O")
        $(this).css("pointer-events" ,"none")
        count++
        turn = 1;
        console.log(count)
        $("#turn").text("Turn: Player-1")
        if(checkWinO()){
            p2Score++
            count = 0
            $("#p2-score").text(p2Score)
            $(".box").removeClass("X O")
            clearBoard();
        }
        else if(count === 9){
            tie++; 
            $("#ties").text(tie)
            clearBoard();
            count = 0;
            console.log(tie)
            console.log(count)
            $(".box").removeClass("X O")
        }
    }
    
})