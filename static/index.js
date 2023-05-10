$(document).ready(function () {
    $(".cur-slide").css("display", "inline");
    $(".cur-slide").css("width", "100%");
});


function newsRight() {
    curSlide = document.getElementsByClassName("cur-slide")[0];
    nextSlide = curSlide.nextElementSibling;
    id = $(nextSlide).attr("id").substring(11);
    $(document.getElementsByClassName("cur-bar")[0]).removeClass("cur-bar");
    $("#slide-bar-"+id).addClass("cur-bar");
    $(nextSlide).css("display", "inline")
    $(curSlide).css("width", "0");
    $(nextSlide).css("width", "100%");
    $(curSlide).css("display", "none");
    $(curSlide).removeClass("cur-slide");
    $(nextSlide).addClass("cur-slide");
    document.getElementById("news-container").appendChild(curSlide.previousElementSibling);
}

function newsLeft() {
    curSlide = document.getElementsByClassName("cur-slide")[0];
    nextSlide = curSlide.previousElementSibling;
    id = $(nextSlide).attr("id").substring(11);
    $(document.getElementsByClassName("cur-bar")[0]).removeClass("cur-bar");
    $("#slide-bar-"+id).addClass("cur-bar");
    $(nextSlide).css("display", "inline")
    $(curSlide).css("width", "0");
    $(nextSlide).css("width", "100%");
    $(curSlide).css("display", "none");
    $(curSlide).removeClass("cur-slide");
    $(nextSlide).addClass("cur-slide");
    document.getElementById("news-container").prepend(curSlide.nextElementSibling);
}