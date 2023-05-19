var placed = 0;

function startGame() {
    $("#start-btn").text(switchColors("Yellow")+"'s Turn");
    $("#start-btn").css("pointer-events", "none");
    $(".connect-col.available").each(function () {
        $(this).click(function () {
            $(".connect-col").each(function () {
                $(this).removeClass("available");
            });
            let col = parseInt(this.classList[1].substring(3));
            for (let row=5; row>-1; row--) {
                if (!$("#row"+row+"col"+col).hasClass("taken")) {
                    let currentColor = $("#start-btn").text().substring(0,$("#start-btn").text().indexOf("'"));
                    placePiece(row, 0, col, currentColor.toLowerCase());
                    break;
                }
            }
        });
    });
}

function placePiece(row, currentRow, col, color) {
    placed++;
    $("#row"+currentRow+"col"+col).addClass(color+"Full");
    setTimeout(() => {
        if (currentRow != row) {
            $("#row"+currentRow+"col"+col).removeClass(color+"Full");
            currentRow++;
            placePiece(row, currentRow, col, color);
        }
        else {
            $(".connect-col").each(function () {
                if (!$(this).hasClass("taken")) {
                    $(this).addClass("available");
                }
            });
            $("#row"+currentRow+"col"+col).removeClass("available");
            $("#row"+currentRow+"col"+col).addClass("taken");
            $("#start-btn").text(switchColors(color) + "'s Turn");
            if ($("."+color.toLowerCase()+"Full").length >= 4) {
                if (checkWin(color.toLowerCase()+"Full", row, col)) {
                    $("#start-btn").text(color.toUpperCase() + ' WINS!');
                    $("#connect-board").css("pointer-events", "none");
                }
                else if (placed == 42) {
                    $("#start-btn").text("Tie");
                    $("#connect-board").css("pointer-events", "none");
                }
            }
        }
    }, 50);
}

function switchColors(color) {
    $(".connect-col.available").each(function () {
        $(this).removeClass(color.toLowerCase());
    });
    if (color == "red") {
        color = "Yellow";
    }
    else {
        color = "Red";
    }
    $(".connect-col.available").each(function () {
        if (!$(this).hasClass("taken")) {
            $(this).addClass(color.toLowerCase());
        }
    });
    return color;
}

function checkWin(colorFull, row, col) {
    return (checkHorizontal(colorFull, row, col) || checkVertical(colorFull, row, col) || checkDiagonal(colorFull, row, col));
}

function checkHorizontal(colorFull, row, col) {
    // console.log("checking horizontal")
    // console.log("");
    let startCol = Math.max(0,col-3);
    while (startCol+3 < 7 && startCol <= col) {
        // console.log("row"+row+"col"+startCol);
        // console.log("row"+row+"col"+(startCol+1));
        // console.log("row"+row+"col"+(startCol+2));
        // console.log("row"+row+"col"+(startCol+3));
        // console.log("");
        if ($("#row"+row+"col"+startCol).hasClass(colorFull) && $("#row"+row+"col"+(startCol+1)).hasClass(colorFull) && $("#row"+row+"col"+(startCol+2)).hasClass(colorFull) && $("#row"+row+"col"+(startCol+3)).hasClass(colorFull)) {
            return true;
        }
        startCol++;
    }
    return false;
}

function checkVertical(colorFull, row, col) {
    // console.log("checking vertical");
    // console.log("");
    if (row < 3) {
        // console.log("row"+row+"col"+col);
        // console.log("row"+(row+1)+"col"+col);
        // console.log("row"+(row+2)+"col"+col);
        // console.log("row"+(row+3)+"col"+col);
        // console.log("");
        if ($("#row"+row+"col"+col).hasClass(colorFull) && $("#row"+(row+1)+"col"+col).hasClass(colorFull) && $("#row"+(row+2)+"col"+col).hasClass(colorFull) && $("#row"+(row+3)+"col"+col).hasClass(colorFull)) {
            return true;
        }
    }
    return false;
}

function checkDiagonal(colorFull, row, col) {
    return (checkRightDiagonal(colorFull, row, col) || checkLeftDiagonal(colorFull, row, col));
}

function checkRightDiagonal(colorFull, row, col) {
    // console.log("checking right diagonal");
    // console.log("");
    let startCol = col;
    let startRow = row;
    let count = 0;
    while (startCol > 0 && startRow < 5 && count < 3) {
        startCol--;
        startRow++;
        count++;
    }
    while (startRow-3 > 0 && startCol+3 < 7) {
        // console.log("row"+startRow+"col"+startCol);
        // console.log("row"+(startRow-1)+"col"+(startCol+1));
        // console.log("row"+(startRow-2)+"col"+(startCol+2));
        // console.log("row"+(startRow-3)+"col"+(startCol+3));
        // console.log("");
        if ($("#row"+startRow+"col"+startCol).hasClass(colorFull) && $("#row"+(startRow-1)+"col"+(startCol+1)).hasClass(colorFull) && $("#row"+(startRow-2)+"col"+(startCol+2)).hasClass(colorFull) && $("#row"+(startRow-3)+"col"+(startCol+3)).hasClass(colorFull)) {
            return true;
        }
        startRow--;
        startCol++;
    }
    return false
}

function checkLeftDiagonal(colorFull, row, col) {
    // console.log("checking left diagonal");
    // console.log("");
    let startCol = col;
    let startRow = row;
    let count = 0;
    while (startCol > 0 && startRow > 0 && count < 3) {
        startCol--;
        startRow--;
        count++;
    }
    while (startRow+3 < 6 && startCol+3 < 7) {
        // console.log("row"+startRow+"col"+startCol);
        // console.log("row"+(startRow+1)+"col"+(startCol+1));
        // console.log("row"+(startRow+2)+"col"+(startCol+2));
        // console.log("row"+(startRow+3)+"col"+(startCol+3));
        // console.log("");
        if ($("#row"+startRow+"col"+startCol).hasClass(colorFull) && $("#row"+(startRow+1)+"col"+(startCol+1)).hasClass(colorFull) && $("#row"+(startRow+2)+"col"+(startCol+2)).hasClass(colorFull) && $("#row"+(startRow+3)+"col"+(startCol+3)).hasClass(colorFull)) {
            return true;
        }
        startRow++;
        startCol++;
    }
    return false;
}

function startOver() {
    location.reload()
}