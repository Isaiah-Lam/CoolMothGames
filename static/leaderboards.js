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
}

$(document).ready(function(){
    $($(".game4row").get().reverse()).each(function () {
        document.getElementById("game4table").appendChild(this);
    });
    $($(".game1row").get().reverse()).each(function () {
        document.getElementById("game1table").appendChild(this);
    });
})