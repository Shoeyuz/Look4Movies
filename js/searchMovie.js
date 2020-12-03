
document.addEventListener('DOMContentLoaded', function() {
    
document.getElementById("actorFinderSubmit").addEventListener('click', createActorSearch);

function createActorSearch() {


  
    let n = document.getElementById("nameActor").value;
    //window.location.assign("http://localhost:3000/movies");
    window.location.assign("/searchPeople?name=" + n );
    //this creates the search querry

    return false; //important to stop default behavior of button
}


document.getElementById("userFinderSubmit").addEventListener('click', createUserSearch);

function createUserSearch() {


    let nam = document.getElementById("userName").value;


    //window.location.assign("http://localhost:3000/movies");
    window.location.assign("/searchUser?name=" + nam);
    //this creates the search querry
    return false; //important to stop default behavior of button
}


document.getElementById("movieFinderSubmit").addEventListener('click', createMovieSearch);

function createMovieSearch() {


    let name = document.getElementById("nameMovie").value;
    let yearMin = document.getElementById("yearMin").value;
    let yearMax = document.getElementById("yearMax").value;
    let rate = document.getElementById("ratingMovie").value;



    if (name == "")
        name = "";

    if (yearMin == "")
        yearMin = 1;

    if (yearMax == "")
        yearMax = 300000;

    if (rate == "")
        rate = 0;
        

    let genre = document.getElementById("genre").value;





    window.location.assign("/searchMovie?name=" + name + "&genre=" + genre + "&yearMax=" +
        yearMax + "&yearMin=" + yearMin + "&minRating=" + rate);
    //this creates the search querry

    return false; //important to stop default behavior of button
}


 });


