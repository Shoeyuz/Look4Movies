


document.getElementById("actorFinderSubmit").addEventListener('click', createActorSearch);

function createActorSearch() {


    let name = document.getElementById("actorName").value;


    //window.location.assign("http://localhost:3000/movies");
    window.location.assign("/searchActor?name=" + name);
    //this creates the search querry

    return false; //important to stop default behavior of button
}


document.getElementById("userFinderSubmit").addEventListener('click', createUserSearch);

function createUserSearch() {


    let name = document.getElementById("userName").value;


    //window.location.assign("http://localhost:3000/movies");
    window.location.assign("/searchUser?name=" + name);
    //this creates the search querry

    return false; //important to stop default behavior of button
}


document.getElementById("movieFinderSubmit").addEventListener('click', createMovieSearch);

function createMovieSearch() {


    let name = document.getElementById("nameMovie").value;
    if (name == "")
        name = "";

    let yearMin = document.getElementById("yearMin").value;
    if (yearMin == "")
        yearMin = 1;

    let yearMax = document.getElementById("yearMax").value;
    if (yearMax == "")
        yearMax = 300000;

    let runTime = document.getElementById("lengthMovie").value;
    if (runTime == "")
        runTime = 3050;
        

    let genre = document.getElementById("genre").value;





    //window.location.assign("http://localhost:3000/movies");
    window.location.assign("/searchMovie?" + name + "&" + genre + "&" +
        yearMax + "&" + yearMin + "&" + runTime);
    //this creates the search querry

    return false; //important to stop default behavior of button
}



