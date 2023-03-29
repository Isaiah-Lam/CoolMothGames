var piecesMoved = {"warook":false, "wking":false, "whrook":false, "wapawn":false, "wbpawn":false, "wcpawn":false, "wdpawn":false, "wepawn":false, "wfpawn":false, "wgpawn":false, "whpawn":false, "barook":false, "bking":false, "bhrook":false, "bapawn":false, "bbpawn":false, "bcpawn":false, "bdpawn":false, "bepawn":false, "bfpawn":false, "bgpawn":false, "bhpawn":false};

$(document).ready(function () {
    $(".piece").each(function () {
        let imageURL = "url(static/imgs/chesspieces/" + this.classList[1] + this.classList[2].toLowerCase() + ".png)";
        $(this).css("background-image", imageURL);
    })
    $(".piece").click(function () {
        startMove(this);
    });
    sessionStorage.setItem("turn", "white")
});

function startMove(piece) {
    console.log("");
    currentSquare = piece.parentElement;
    if (piece.classList[1] == sessionStorage.getItem("turn")) {
        $(".piece").off("click");
        showValidMoves(piece.classList, piece.parentElement, true);
        $(".valid").on("click", function () {
            if (endMove(piece, $(this).get(0), piece.parentElement)) {
                endMove(piece, currentSquare, piece.parentElement);
            }
            else if (inCheck(sessionStorage.getItem("turn"))) {
                if (inCheckmate(sessionStorage.getItem("turn"))) {
                    endGame(sessionStorage.getItem("turn"), "checkmate");
                }
            }
            else {
                if (sessionStorage.getItem("turn") == "white") {
                    sessionStorage.setItem("turn", "black");
                }
                else {
                    sessionStorage.setItem("turn", "white");
                }
                flipBoard()
            }
            
        });
        $(piece).on("click", function () {
            cancelMove();
        });
    }
}

function showValidMoves(classes, currentSquare, show) {
    let pieceType = classes[2];
    let pieceColor = classes[1];
    var validSquares = [];
    if (pieceType == "Rook") {
        validSquares = showRookMoves(pieceColor, currentSquare);
    }
    else if (pieceType == "Knight") {
        validSquares = showKnightMoves(pieceColor, currentSquare);
    }
    else if (pieceType == "Bishop") {
        validSquares = showBishopMoves(pieceColor, currentSquare);
    }
    else if (pieceType == "Queen") {
        validSquares = showQueenMoves(pieceColor, currentSquare);
    }
    else if (pieceType == "King") {
        validSquares = showKingMoves(pieceColor, currentSquare);
    }
    else {
        if (pieceColor == "black") {
            validSquares = showPawnMoves(pieceColor, currentSquare, -1);
        }
        else {
            validSquares = showPawnMoves(pieceColor, currentSquare, 1);
        }
    }

    if (show) {
        for (let i=0; i<validSquares.length; i++) {
            $(validSquares[i]).addClass("valid");
        }
    }
    
    return validSquares;
    
}

function showRookMoves(pieceColor, currentSquare) {
    // still needs to make sure king not in check post move
    let validSquares = [];
    let col = $(currentSquare).attr("id").substring(3,4);
    let row = parseInt($(currentSquare).attr("id").substring(7));

    for (let i=row+1; i<9; i++) {
        let destination = document.getElementById("col"+col+"row"+i);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let i=row-1; i>0; i--) {
        let destination = document.getElementById("col"+col+"row"+i);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let i=col.charCodeAt(0)+1; i<73; i++) {
        let destination = document.getElementById("col"+String.fromCharCode(i)+"row"+row);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let i=col.charCodeAt(0)-1; i>64; i--) {
        let destination = document.getElementById("col"+String.fromCharCode(i)+"row"+row);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }




    return validSquares;
}

function showKnightMoves(pieceColor, currentSquare) {
    // still needs to make sure king not in check post move
    let validSquares = [];
    let col = $(currentSquare).attr("id").substring(3,4);
    let row = parseInt($(currentSquare).attr("id").substring(7));
    let coords = [{"r":2, "c":-1}, {"r":2, "c":1}, {"r":1, "c":2}, {"r":-1, "c":2}, {"r":-2, "c":1}, {"r":-2, "c":-1}, {"r":-1, "c":-2}, {"r":1, "c":-2}];

    for (let i=0; i<coords.length; i++) {
        let newCoords = {"r":row+coords[i]["r"], "c":col.charCodeAt(0)+coords[i]["c"]};
        let destination = document.getElementById("col"+String.fromCharCode(newCoords["c"])+"row"+newCoords["r"]);
        if (destination) {
            if (destination.firstElementChild) {
                if (!$(destination.firstElementChild).hasClass(pieceColor)) {
                    validSquares.push(destination);
                }
            }
            else {
                validSquares.push(destination);
            }
        }
    }
    return validSquares;
}

function showBishopMoves(pieceColor, currentSquare) {
    // still needs to make sure king not in check post move
    let validSquares = [];
    let col = $(currentSquare).attr("id").substring(3,4);
    let row = parseInt($(currentSquare).attr("id").substring(7));

    for (let r=row+1, c=col.charCodeAt(0)+1; r<9 && c<73; r++, c++) {
        let destination = document.getElementById("col"+String.fromCharCode(c)+"row"+r);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let r=row-1, c=col.charCodeAt(0)+1; r>0 && c<73; r--, c++) {
        let destination = document.getElementById("col"+String.fromCharCode(c)+"row"+r);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let r=row-1, c=col.charCodeAt(0)-1; r>0 && c>64; r--, c--) {
        let destination = document.getElementById("col"+String.fromCharCode(c)+"row"+r);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }

    for (let r=row+1, c=col.charCodeAt(0)-1; r<9 && c>64; r++, c--) {
        let destination = document.getElementById("col"+String.fromCharCode(c)+"row"+r);
        if (destination.firstElementChild) {
            let piece = destination.firstElementChild;
            if (!$(piece).hasClass(pieceColor)) {
                validSquares.push(destination);
            }
            break;
        }
        validSquares.push(destination);
    }
    return validSquares;
}

function showQueenMoves(pieceColor, currentSquare) {
    return showRookMoves(pieceColor, currentSquare).concat(showBishopMoves(pieceColor, currentSquare));
}

function showKingMoves(pieceColor, currentSquare) {
    // still needs to make sure king not in check post move
    let validSquares = [];
    let col = $(currentSquare).attr("id").substring(3,4);
    let row = parseInt($(currentSquare).attr("id").substring(7));
    let coords = [{"r":1, "c":0}, {"r":1, "c":1}, {"r":0, "c":1}, {"r":-1, "c":1}, {"r":-1, "c":0}, {"r":-1, "c":-1}, {"r":0, "c":-1}, {"r":1, "c":-1}];

    for (let i=0; i<coords.length; i++) {
        let newCoords = {"r":row+coords[i]["r"], "c":col.charCodeAt(0)+coords[i]["c"]};
        let destination = document.getElementById("col"+String.fromCharCode(newCoords["c"])+"row"+newCoords["r"]);
        if (destination) {
            if (destination.firstElementChild) {
                if (!$(destination.firstElementChild).hasClass(pieceColor)) {
                    validSquares.push(destination);
                }
            }
            else {
                validSquares.push(destination);
            }
        }
    }

    if (!piecesMoved[$(currentSquare.firstElementChild).attr("id").toLowerCase()]) {
        if (!piecesMoved[pieceColor.substring(0,1)+"arook"] && showRookMoves(pieceColor, document.getElementById("colArow"+$(currentSquare).attr("id").substring(7))).includes(document.getElementById("colDrow"+$(currentSquare).attr("id").substring(7)))) {
            validSquares.push(document.getElementById("colCrow"+$(currentSquare).attr("id").substring(7)));
        }
        if (!piecesMoved[pieceColor.substring(0,1)+"hrook"] && showRookMoves(pieceColor, document.getElementById("colHrow"+$(currentSquare).attr("id").substring(7))).includes(document.getElementById("colFrow"+$(currentSquare).attr("id").substring(7)))) {
            validSquares.push(document.getElementById("colGrow"+$(currentSquare).attr("id").substring(7)));
        }
    }
    

    return validSquares;
}

function showPawnMoves(pieceColor, currentSquare, direction) {
    // still needs to make sure king not in check post move
    let validSquares = [];
    let col = $(currentSquare).attr("id").substring(3,4);
    let row = parseInt($(currentSquare).attr("id").substring(7));
    let canTakeIfPiece = true;
    let coords = [{"r":direction, "c":-1}, {"r":direction, "c":0}, {"r":direction, "c":1}];
    if (!piecesMoved[$(currentSquare.firstElementChild).attr("id").toLowerCase()]) {
        coords.push({"r":direction*2, "c":0});
    }

    for (let i=0; i<coords.length; i++) {
        let newCoords = {"r":row+coords[i]["r"], "c":col.charCodeAt(0)+coords[i]["c"]};
        let destination = document.getElementById("col"+String.fromCharCode(newCoords["c"])+"row"+newCoords["r"]);
        if (destination) {
            if (destination.firstElementChild) {
                if (canTakeIfPiece && !$(destination.firstElementChild).hasClass(pieceColor)) {
                    validSquares.push(destination);
                }
            }
            else if (!canTakeIfPiece) {
                validSquares.push(destination);
            }
        }
        canTakeIfPiece = !canTakeIfPiece;
    }
    return validSquares;
}

function endMove(piece, destination, currentSquare) {
    $(".valid").off("click");
    $(".valid").removeClass("valid");
    if (destination.firstChild) {
        $(destination).find(":first-child").remove();
    }
    piecesMoved[$(piece).attr("id").toLowerCase()] = true;
    if (piece.classList[2] == "King" && Math.abs($(currentSquare).attr("id").substring(3,4).charCodeAt(0)-$(destination).attr("id").substring(3,4).charCodeAt(0)) == 2) {
        if ($(destination).attr("id").substring(3,4) == "C") {
            endMove($("#"+piece.classList[1].substring(0,1)+"ARook").get(0), $("#colDrow"+$(destination).attr("id").substring(7)).get(0), document.getElementById("colArow"+$(destination).attr("id").substring(7)));
        }
        else {
            endMove($("#"+piece.classList[1].substring(0,1)+"HRook").get(0), $("#colFrow"+$(destination).attr("id").substring(7)).get(0), document.getElementById("colHrow"+$(destination).attr("id").substring(7)));
        }
        
    }
    $(destination).append(piece);
    $(".piece").click(function () {
        startMove(this);
    });
    return selfCheck();
}


function inCheck(checkingColor) {
    let kingColor;
    if (checkingColor == "white") {
        kingColor = "b"
    }
    else {
        kingColor = "w"
    }
    let king = document.getElementById(kingColor+"EKing");
    let check = false;
    $("."+checkingColor).each(function () {
        if (showValidMoves(this.classList, this.parentElement, false).includes(king.parentElement)) {
            check = true;
            return false;
        }
    });
    console.log(check);
    return check;
}


function selfCheck() {
    let checkingColor;
    if (sessionStorage.getItem("turn") == "white") {
        checkingColor = "black";
    }
    else {
        checkingColor = "white";
    }
    console.log("self:")
    return inCheck(checkingColor);
}


function inCheckmate(checkingColor) {
    let checkedColor;
    if (checkingColor == "white") {
        checkedColor = "black";
    }
    else {
        checkedColor = "white";
    }
    var checkmate = true;
    $("."+checkedColor).each(function () {
        let validSquares = showValidMoves(this.classList, this.parentElement, false);
        for (let i=0; i<validSquares.length; i++) {
            let currentSquare = this.parentElement;
            if (!endMove(this, validSquares[i], this.parentElement)) {
                checkmate = false;
            }
            endMove(this, currentSquare, this.parentElement);
            if (!checkmate) {
                break;
            }
        }
        return checkmate;
    });
    console.log("checkmate:\n"+checkmate)
    return checkmate;
}


function cancelMove() {
    $(".valid").off("click");
    $(".valid").removeClass("valid");
    $(".piece").click(function () {
        startMove(this);
    });
}


function flipBoard() {
    $($(".square").get().reverse()).each(function () {
        document.getElementById("board-div").appendChild(this);
    });
}


function endGame(winner, type) {
    console.log(winner + " wins by " + type);
    $(".piece").off("click");
}
