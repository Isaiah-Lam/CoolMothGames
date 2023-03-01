function toggleForm(hide, show) {
    $(hide).hide();
    $(show).show();
    $("#suggestion-form").slideToggle();
}

$(".filter-input").on('input', function () {
        $(".song").each(function () {
            let title = $(this).children("td.song-title").html().toLowerCase();
            let artist = $(this).children("td.song-artist").html().toLowerCase();
            let album = $(this).children("td.song-album").html().toLowerCase();
            let explicit = $(this).children("td.song-explicit").html().toLowerCase();
            let attributes = [title, artist, album, explicit];
            let filters = [$("#title-filter").val().toLowerCase(), $("#artist-filter").val().toLowerCase(), $("#album-filter").val().toLowerCase(), $("#explicit-filter").val().toLowerCase()];
            for (let i = 0; i < attributes.length; i++) {
                if (!(attributes[i].includes(filters[i]))) {
                    $(this).hide();
                    return null;
                }
            }
            $(this).show();
            return null;
        });
});