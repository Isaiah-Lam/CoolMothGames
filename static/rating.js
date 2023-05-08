const stars = document.querySelectorAll(".star");

    stars.forEach(function(star) {
      star.addEventListener("click", setRating);
      star.addEventListener("mouseover", fillStars);
    //   star.addEventListener("mouseout", resetStars);
    });

    function setRating(e) {
      const rating = e.currentTarget.getAttribute("data-value");
      document.getElementById("rating").value = rating;
      starClicked(e);
      console.log("star clicked")
    }

    function fillStars(e) {
        const rating = e.currentTarget.getAttribute("data-value");
        stars.forEach(function(star, index) {
            console.log(star)
          if (index < rating) {
            console.log("filled")
            star.classList.add("star-filled");
          } 
          else {
            star.classList.remove("star-filled");
          }
        });
      }

      function starClicked(e){
        const rating = e.currentTarget.getAttribute("data-value");
        stars.forEach(function(star, index) {
            if (index < rating) {
                console.log("filled")
                star.classList.add("star-clicked");
              }
              else{
                star.classList.remove("star-clicked")
              }
          }) 
      }
      

    function resetStars() {
      stars.forEach(function(star) {
        star.classList.remove("star-filled");
      });
    }