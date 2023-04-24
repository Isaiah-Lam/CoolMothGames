function addFilter(category, type, input) {
    let newFilter = document.createElement("div");
    $(newFilter).addClass("current-filter");
    let filter = document.createElement("h4");
    let text = "*";

    if (type == "and") {
        text = text + "does contain: ";
    }
    else if (type == "or") {
        text = text + "or contains: ";
    }
    else if (type == "not") {
        text = text + "does not contain: ";
    }

    text = text + input + "*";
    
    $(filter).text(text);
    newFilter.appendChild(filter);
    $(newFilter).addClass("current-filter");

    if (document.getElementById("current-"+category+"-filters")) {
        document.getElementById("current-"+category+"-filters").appendChild(filter);
    }
    else {
        let newCategory = document.createElement("div");
        $(newCategory).attr("id", "current-"+category+"-filters");
        let categoryHead = document.createElement("h4");
        $(categoryHead).text(category.toUpperCase() + ":");
        newCategory.appendChild(categoryHead);
        newCategory.appendChild(newFilter);
        document.getElementById("current-filters-div").appendChild(newCategory);
    }

}