

document.addEventListener('DOMContentLoaded', function () {

  document.getElementById("addNewMovie").addEventListener('click', openNewMovie);

  document.getElementById("closeNewMovie").addEventListener('click', closeNewMovie);

  document.getElementById("cancelNewMovie").addEventListener('click', closeNewMovie);
  document.getElementById("submitNewMovie").addEventListener('click', addMovie);



  function openNewMovie() {
    document.getElementById("movieModal").classList.add("is-active");
  }

  function closeNewMovie() {
    document.getElementById("movieModal").classList.remove("is-active");

    //clears the input in the form
    document.getElementById("newMovieForm").reset();
  }

  function addMovie() {
    const title = document.getElementById("title").value;
    const rated = document.getElementById("rated").value;
    const plot = document.getElementById("plot").value;
    const actors = document.getElementById("actors").value;
    const writers = document.getElementById("writers").value;
    const director = document.getElementById("director").value;
    const runtime = document.getElementById("runtime").value;
    const release = document.getElementById("release").value;
    const genres = document.getElementById("genres").value;
    const year = document.getElementById("year").value;
    const poster = document.getElementById("poster").value;


    const sending = [];
    sending.push(title);
    sending.push(rated);
    sending.push(plot);
    sending.push(actors);
    sending.push(writers);
    sending.push(director);
    sending.push(runtime);
    sending.push(release);
    sending.push(genres);
    sending.push(year);
    sending.push(poster);
    if (title == "" || rated == "" || plot == "" || actors == "" || writers == "" || director == "" || runtime == "" || release == "" || genres == "" || year == "" || poster == "") {
      alert("Please do not leave fields blank");

    }
    else {
      fetch("/movies/newMovie", {
        method: "post",
        body: JSON.stringify(sending)
      }).then(() => {
      }).catch(err => {
        alert(err);
      })


      closeNewMovie();
    }
  }






});
