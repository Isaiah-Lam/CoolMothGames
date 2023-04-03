$(document).ready(function () {
    sessionStorage.clear();
});

function changeDifficulty(difficulty) {
    sessionStorage.setItem("difficulty", difficulty);
    let pairs, rows, cols;
    if (difficulty == "Easy") {
        pairs = 6;
        rows = 3;
        cols = 4;
    }
    else if (difficulty == "Medium") {
        pairs = 12;
        rows = 4;
        cols = 6;
    }
    else if (difficulty == "Hard") {
        pairs = 21;
        rows = 6;
        cols = 7;
    }
    sessionStorage.setItem("pairs", pairs);
    let board = document.getElementById("mem-table");
    for (let r=0; r<rows; r++) {
        let row = document.createElement("tr");
        $(row).addClass("mem-row");
        for (let c=0; c<cols; c++) {
            let cell = document.createElement("td");
            $(cell).addClass("mem-cell");
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
    $("#start-btn").prop("disabled", false);
}

function startGame(btn) {
    btn.innerHTML = "Shuffling..."
    $(btn).css("pointer-events", "none");
    $("#table-div").slideUp(1250, function () {
        var moths = [];
        let pairs = parseInt(sessionStorage.getItem("pairs"));
        for (let i=1; i<pairs+1; i++) {
            moths.push("moth"+i);
            moths.push("moth"+i);
        }
        console.log(moths);

        $(".mem-cell").each(function () {
            let picNum = Math.floor(Math.random() * moths.length);
            $(this).css("background-image", "url(static/imgs/moths/"+moths[picNum]+".jpg)");
            this.classList.add(moths[picNum]);
            this.classList.add("facedown");
            // $(this).css("background", "linear-gradient(rgba(29, 44, 181, 1), rgba(29, 44, 181, 1)), url(static/imgs/"+moths[picNum]+")");
            moths.splice(picNum, 1);

            $(this).click(function () {
                $(this).removeClass("facedown");
                $(this).addClass("faceup")

                var faceupMoths = $(".faceup");
                if (faceupMoths.length >= 2) {
                    $("#memory-score").val(parseInt($("#memory-score").val())+1);
                    let sharedClasses = 0;
                    for (let i=0; i<3; i++) {
                        if (faceupMoths[0].classList.contains(faceupMoths[1].classList[i])) {
                            sharedClasses++;
                        }
                    }
                    if (sharedClasses >= 3) {
                        setTimeout(() => {
                            $(faceupMoths[0]).css("visibility", "hidden");
                            $(faceupMoths[1]).css("visibility", "hidden");
                            $(faceupMoths[0]).removeClass("faceup");
                            $(faceupMoths[1]).removeClass("faceup");
                            $(faceupMoths[0]).addClass("solved");
                            $(faceupMoths[1]).addClass("solved");
                            console.log($(".solved"));
                            if ($(".solved").length == parseInt(sessionStorage.getItem("pairs"))*2) {
                                $("#difficulty").val(sessionStorage.getItem("difficulty"));
                                $("#memory-form").submit();
                            }
                        }, 2500);
                            
                    }
                    else {
                        setTimeout(() => {
                            faceupMoths.each(function () {
                                this.classList.remove("faceup");
                                this.classList.add("facedown");
                            })
                        }, 2500);
                    }
                }
            });
        });

        $("#table-div").slideDown(1250, function () {
            btn.innerHTML = "Attempts taken:";
            $("#memory-score").val(0)
        });
        
    });

    $("#table-div").css("visibility", "visible");



}