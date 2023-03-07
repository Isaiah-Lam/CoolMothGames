function startGame(btn) {
    btn.innerHTML = "Shuffling..."
    $(btn).css("pointer-events", "none");
    $("#table-div").slideUp(1250, function () {
        var moths = [];
        for (let i=1; i<22; i++) {
            moths.push("moth"+i);
            moths.push("moth"+i);
        }

        $(".mem-cell").each(function () {
            let picNum = Math.floor(Math.random() * moths.length);
            $(this).css("background-image", "url(static/imgs/"+moths[picNum]+".jpg)");
            this.classList.add(moths[picNum]);
            this.classList.add("facedown");
            // $(this).css("background", "linear-gradient(rgba(29, 44, 181, 1), rgba(29, 44, 181, 1)), url(static/imgs/"+moths[picNum]+")");
            moths.splice(picNum, 1);

            $(this).click(function () {
                $(this).removeClass("facedown");
                $(this).addClass("faceup")

                var faceupMoths = $(".faceup");
                if (faceupMoths.length >= 2) {
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
                            if ($(".solved").length == 4) {
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
                    $("#memory-score").val(parseInt($("#memory-score").val())+1);
                }
            });
        });

        $("#table-div").slideDown(1250, function () {
            btn.innerHTML = "Attempts taken:";
            $("#memory-score").val(0)
        });
        
    });





}