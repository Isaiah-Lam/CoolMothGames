$(document).ready(function () {
    console.log("ready");
    $(".piece").click(function () {
        startMove(this);
    });
});


function startMove(piece) {
    console.log(piece);
    $(".piece").off("click");
    showValidMoves(this.classList);
    setTimeout(() => {
        $(".valid").on("click", function () {
            console.log("ending")
            endMove(piece, $(this).get(0));
        });
    }, 10);
    
}


function showValidMoves(classes) {
    let pieceType = classes[2];
    let pieceColor = classes[1];
    var validSquares;
    if (pieceType == "Rook") {
        validSquares = showRookMoves(pieceColor);
    }
    else {
        if (pieceColor == "Black") {
            
        }
    }



    $(".square").addClass("valid");
}


function endMove(piece, square) {
    $(".valid").off("click");
    $(".valid").removeClass("valid");
    if (square.firstChild) {
        $(square).find(":first-child").remove();
    }
    $(square).append(piece);

    $(".piece").click(function () {
        startMove(this);
    });
}


function flipBoard() {
    $($(".square").get().reverse()).each(function () {
        document.getElementById("board-div").appendChild(this);
    });
}

