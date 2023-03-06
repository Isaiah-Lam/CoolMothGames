function change(btn) {
    if (btn.innerHTML == "signup") {
        $("#login-div").css("width", "0");
        $("#login-div").css("border", "none");
        $("#signup-div").css("border", "1px solid black");
        $("#signup-div").css("width", "33%");
        btn.innerHTML = "login"
    }
    else {
        $("#signup-div").css("width", "0");
        $("#signup-div").css("border", "none");
        $("#login-div").css("border", "1px solid black");
        $("#login-div").css("width", "33%");
        btn.innerHTML = "signup"
    }

}