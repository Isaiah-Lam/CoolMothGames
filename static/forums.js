$(".reply-btn").click(function() {
    replyID = document.createElement("input");
    console.log(this.id);
    $("#replyTo").remove();
    $(replyID).attr("value", this.id);
    $(replyID).attr("name", "replyTo");
    $(replyID).attr("id", "replyTo");
    $(replyID).css("display", "none");
    $("#submit").append(replyID);
    $("#reply-to").empty();
    $("#reply-to").append("Relpying to " + this.id + "'s message");
    $("#reply-to").css("display", "block");
})