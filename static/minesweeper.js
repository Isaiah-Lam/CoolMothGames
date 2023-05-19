var timerActive = false;

function changeDifficulty(difficulty) {
    sessionStorage.setItem("difficulty", difficulty);
    let height, width, mines;
    if (difficulty == "Easy") {
        height = 9;
        width = 9;
        mines = 10;
    }
    else if (difficulty == "Medium") {
        height = 16;
        width = 16;
        mines = 40;
    }
    else if (difficulty == "Hard") {
        height = 16;
        width = 30;
        mines = 99;
    }
    sessionStorage.setItem("height", height);
    sessionStorage.setItem("width", width);
    sessionStorage.setItem("mines", mines);
    let board = document.getElementById("board");
    while (board.firstChild) {
        board.removeChild(board.lastChild);
    }
    for (let r=0; r<height; r++) {
        let row = document.createElement("tr");
        $(row).addClass("board-row");
        $(row).attr("id", "row"+r);
        for (let c=0; c<width; c++) {
            let cell = document.createElement("td");
            $(cell).addClass("board-cell");
            $(cell).attr("id", "row"+r+"col"+c);
            $(cell).click(function () {
                firstClick($(this).attr("id"));
            });
            $(cell).on("contextmenu", function (e) {
                flag(this);
                return false;
             });
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    $(board).on("contextmenu", function (e) {
        return false;
    });
    $(board).css("visibility", "visible");
}


function stopwatch() {
    if (timerActive) {
        let centiseconds = parseInt($("#centiseconds").text());
        let seconds = parseInt($("#seconds").text());
        centiseconds++;
        if (centiseconds == 100) {
            seconds++;
            if (seconds == 999) {
                timerActive = false;
            }
            centiseconds = 0;
        }
        centiseconds = ""+centiseconds;
        if (centiseconds < 10) {
            centiseconds = "0"+centiseconds;
        }
        seconds = ""+seconds;
        $("#centiseconds").text(centiseconds);
        $("#seconds").text(seconds);
        setTimeout(stopwatch, 10);
    }
}




function firstClick(id) {
    let cell = document.getElementById(id);
    let rows = sessionStorage.getItem("height");
    let cols = sessionStorage.getItem("width");
    let mines = sessionStorage.getItem("mines");
    let spotsLeft = rows*cols;
    var startCells = [cell];
    console.log(id);
    let idx = parseInt(id.substring(5).replace ( /[^\d.]/g, '' ));
    let idy = parseInt(id.substring(0,5).replace ( /[^\d.]/g, '' ));
    let startCoords = {"x":idx, "y":idy};
    console.log(startCoords);
    var coords = [{"x":0,"y":1},{"x":1,"y":1},{"x":1,"y":0},{"x":1,"y":-1},{"x":0,"y":-1},{"x":-1,"y":-1},{"x":-1,"y":0},{"x":-1,"y":1}];
    for (let i=0; i<8; i++) {
        let newCoords = {"x":startCoords["x"]+coords[i]["x"], "y":startCoords["y"]+coords[i]["y"]}
        if (newCoords["x"] >= 0 && newCoords["x"] < cols && newCoords["y"] >= 0 && newCoords["y"] < rows) {
            startCells.push(document.getElementById("row"+newCoords["y"]+"col"+newCoords["x"]));
        }
    }
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            if (!startCells.includes(document.getElementById("row"+r+"col"+c))) {
                let rand = Math.random();
                if (rand < (mines/spotsLeft)) {
                    $("#row"+r+"col"+c).addClass("mine");
                    mines--;
                }
            }
            spotsLeft--;
            $("#row"+r+"col"+c).off('click').on("click", function () {
                click(this, true);
            });
        }
    }
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            let currentCell = document.getElementById("row"+r+"col"+c);
            if (!$(currentCell).hasClass("mine")) {
                let mineCount = 0;
                var coords = [{"x":0,"y":1},{"x":1,"y":1},{"x":1,"y":0},{"x":1,"y":-1},{"x":0,"y":-1},{"x":-1,"y":-1},{"x":-1,"y":0},{"x":-1,"y":1}];
                for (let i=0; i<8; i++) {
                    let newCoords = {"x":c+coords[i]["x"], "y":r+coords[i]["y"]};
                    if (newCoords["x"] >= 0 && newCoords["x"] < cols && newCoords["y"] >= 0 && newCoords["y"] < rows) {
                        if ($("#row"+newCoords["y"]+"col"+newCoords["x"]).hasClass("mine")) {
                            mineCount++;
                        }
                    }
                }
                let num = document.createElement("p");
                $(num).text(mineCount);
                $(num).addClass("hidden");
                currentCell.appendChild(num);
            }
        }
    }
    click(startCells[0], true);
    timerActive = true;
    stopwatch();
}


function click(cell, userClick) {
    let rows = sessionStorage.getItem("height");
    let cols = sessionStorage.getItem("width");
    if (!$(cell).hasClass("flagged")) {
        $(cell).css("pointer-events", "none");
        if ($(cell).hasClass('mine')) {
            endGame(false);
        }
        else {
            let idx = parseInt(cell.id.substring(5).replace ( /[^\d.]/g, '' ));
            let idy = parseInt(cell.id.substring(0,5).replace ( /[^\d.]/g, '' ));
            let startCoords = {"x":idx, "y":idy};
            $(cell).css("background-color", "gray");
            $(cell.firstChild).removeClass("hidden");
            if ($(cell.firstChild).text() == "0") {
                var coords = [{"x":0,"y":1},{"x":1,"y":1},{"x":1,"y":0},{"x":1,"y":-1},{"x":0,"y":-1},{"x":-1,"y":-1},{"x":-1,"y":0},{"x":-1,"y":1}];
                for (let i=0; i<8; i++) {
                    let newCoords = {"x":startCoords["x"]+coords[i]["x"], "y":startCoords["y"]+coords[i]["y"]}
                    if (newCoords["x"] >= 0 && newCoords["x"] < cols && newCoords["y"] >= 0 && newCoords["y"] < rows) {
                        // setTimeout(() => {
                        // console.log("row"+newCoords["y"]+"col"+newCoords["x"]);
                        if ($(document.getElementById("row"+newCoords["y"]+"col"+newCoords["x"]).firstChild).hasClass("hidden")) {
                            click(document.getElementById("row"+newCoords["y"]+"col"+newCoords["x"]), false);
                        }
                        // }, 1000);
                    }
                }
            }
            if (userClick) {
                checkWin();
            }
        }
    }
    
}


function flag(cell) {
    $(cell).toggleClass("flagged");
    // let color = $(cell).css("background-color");
    // console.log(color);
    // if (color == "darkorange") {
    //     $(cell).css("background-color", "darkgray");
    // }
    // else {
    //     $(cell).css("background-color", "darkorange");
    // }
}


function checkWin() {
    let rows = sessionStorage.getItem("height");
    let cols = sessionStorage.getItem("width");
    for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
            if ($(document.getElementById("row"+r+"col"+c).firstChild).hasClass("hidden")) {
                return false;
            }
        }
    }
    endGame(true);
}


function endGame(win) {
    let difficulty = sessionStorage.getItem("difficulty")
    sessionStorage.clear()
    timerActive = false;
    $(".board-cell").each(function () {
        $(this).css("pointer-events", "none");
    });
    if (win) {
        $(".mine").each(function () {
            $(this).css("background-color", "darkorange");
        });
        let scoreForm = document.createElement("form");
        $(scoreForm).attr("action", "/minesweeper");
        $(scoreForm).attr("method", "post");
        let scoreInput = document.createElement("input");
        $(scoreInput).attr("type", "number");
        $(scoreInput).attr("name", "score");
        $(scoreInput).val(parseInt($("#seconds").text())+(parseInt($("#centiseconds").text())/100));
        scoreForm.appendChild(scoreInput);
        let difficultyInput = document.createElement("input");
        $(difficultyInput).attr("name", "difficulty");
        $(difficultyInput).val(difficulty);
        scoreForm.appendChild(difficultyInput);
        document.getElementById("game-stuff").appendChild(scoreForm);
        $(scoreForm).submit();
    }
    else {
        $(".mine").each(function () {
            $(this).css("background-color", "red");
        });
    }
}

