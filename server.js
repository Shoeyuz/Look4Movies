
const http = require('http');
const pug = require('pug');
const fs = require("fs");
const express = require('express');
const app = express();
const path = require("path");
const session = require('express-session');
app.use(session({ secret: 'someSecret' }));



let movieData = require("./movies.json");
const { response } = require('express');
const { Z_FIXED } = require('zlib');
let movieGenres = [];
let movieActors = [];
let movieWriters = [];
let movieDirector;


app.set("view engine", "pug");

app.use(function(req,res,next){
    console.log("-------------------------");
    console.log("Request Method: "+ req.method);
    console.log("Request URL: "+ req.url);
    console.log("Request PATH: "+ req.path);
	console.log("Request Session: " + req.session);
	console.log("Request user: " + req.session.user);

    console.log(req.session)

    console.log();
    next();
});
/*

login route:
req.session.user = getValue user
req.session.loggedin = true

{user: req.session.user}
logout route:

*/

let moviesAbove70 = []; //gets list of popular movies (above 7,0 rating)
//server initialization and router creation

let movieRouter = require("./routes/movie-router");
app.use("/movies/", movieRouter);


let actorRouter = require("./routes/actor-router");
app.use("/people/", actorRouter);


let userRouter = require("./routes/user-router");
app.use("/users/", userRouter);


//GETTING THE LANDING PAGES OF THE MAIN SERVER
app.get("/", (req, res, next) => {
	res.render("pages/index", {loggedIn: req.session.loggedIn});
});

app.get("/movies", (req, res, next) => {
	getMostPopular();
	res.render("pages/movies", {loggedIn: req.session.loggedIn, moviesToShow: moviesAbove70, contributing: req.session.contributor });
});

app.get("/people", (req, res, next) => {
	res.render("pages/actors", {loggedIn: req.session.loggedIn, contributing: req.session.contributor});
});

app.get("/search", (req, res, next) => {
	res.render("pages/searchMovie", {loggedIn: req.session.loggedIn});
});


app.get("/selfProfile", (req, res, next) => {
	res.render("pages/selfProfile", {loggedIn: req.session.loggedIn});
});



app.get("/searchMovie?", (req, res, next) => {
	let movName = req.query.name;
	let movGenre = req.query.genre;
	let movMax = req.query.yearMax;
	let movMin = req.query.yearMin;
	let rate = req.query.minRating;


	let posMov = searchForMovie(movName, movGenre, movMax, movMin, rate);

	res.render("pages/searchMovieResults", {loggedIn: req.session.loggedIn, movies: posMov })
});


app.get("/searchPeople?", (req, res, next) => {
	let name = req.query.name;
	console.log(name);
	let posActors = searchForActors(name);

	res.render("pages/searchActorResults", {loggedIn: req.session.loggedIn, people: posActors });
});
//GETTING THE JAVASCRIPT FUNCTIONS FOR THE MAIN SERVER
app.get("/js/navigation.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "navigation.js");
});
app.get("/js/reviewRate.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "reviewRate.js");
});
app.get("/js/searchMovie.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "searchMovie.js");
});
app.get("/js/selfProfile.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "selfProfile.js");
});
app.get("/js/singleActor.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "singleActor.js");
});
app.get("/js/movies.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "movies.js");
});
app.get("/js/actors.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "actors.js");
});
app.get("/js/auth.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "auth.js");
});
app.get("/js/selfProfile.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "selfProfile.js");
});




app.listen(3000);
console.log("Server listening at http://localhost:3000.");


/*
FUNCTION: To get the most popular array of movies from the datbase based on reviews above 7
*/
function getMostPopular() {
	moviesAbove70 = [];
	//clears array at the start to ensure no constant addons
	for (movie in movieData) {
		let fileName = path.join("jsonData/movies/" + movieData[movie].Title);

		if (fs.existsSync(fileName)) {
			let data = fs.readFileSync(fileName);
			let movData = JSON.parse(data);

			if (movData.imdbRating > 7) {
				moviesAbove70.push(movieData[movie]);
			}

		} else {
			res.status(404).send("Could not find Movie.");
		}
	}
}


//console.log(searchForUser("M"));
//Function to search for users based on name or part of it, returns user objects
function searchForUser(name) {
	let possibleUsers = [];

	for (element in users) {
		if (users[element].name.includes(name)) {
			possibleUsers.push(users[element]);
		}
	}

	return possibleUsers;
}

//Functions to search for actors based on the name or part of it, returns actor objects
function searchForActors(name) {
	let possibleActors = [];




	const readFolder = 'jsonData/people/';


	fs.readdirSync(readFolder).forEach(file => {
		let data = fs.readFileSync(readFolder + file);
		let actData = JSON.parse(data);
		if (actData.name.includes(name)) {
			possibleActors.push(actData);
		}
	});
	//console.log(possibleActors);
	return possibleActors;
}


//Function to search for movie based on name(string), genre (needs to be string), release year caps, and run time. Returns movie objects
function searchForMovie(name, genre, releaseYearMax, releaseYearMin, rateMin) {
	let possibleMovies = [];

	if (name == null)
		name = "";

	if (releaseYearMax == null)
		releaseYearMax = 30000;

	if (releaseYearMin == null)
		releaseYearMin = -100;

	if (rateMin == null)
		rateMin = 0;

	if (genre == null)
		genre = "";

	const readFolder = 'jsonData/movies/';

	fs.readdirSync(readFolder).forEach(file => {
		let data = fs.readFileSync(readFolder + file);
		let movData = JSON.parse(data);
		if (movData.Title.includes(name) && movData.Year >= releaseYearMin && movData.Year <= releaseYearMax && movData.Genre.includes(genre)) {
			if(findAverage(movData.Title) >= rateMin){
				possibleMovies.push(movData);
			}
		}
	});


	return possibleMovies;
}




//given list of liked movies find recommendation
//Again based off of liked movie list which will then check for similar movies THAT ARE HIGHER RATED THAN 6.0
//console.log(getRecommendedMovie(users[1002].likedMovies));

function getRecommendedMovie(liked) {
	let sim = [];

	liked.forEach(element => {
		for (let i = 0; i < movieData.length; i++) {
			if (movieData[i].Title === element) {
				liked.pop();
				liked.push(movieData[i]);
			}
		}
	});



	liked.forEach(element => {
		for (let i = 0; i < movieData.length; i++) {
			let temp = movieData[i].Genre.split(", ");
			let here = 0;


			for (let j = 0; j < temp.length; j++) {
				if (element.Genre.includes(temp[j]) && element.Rated === (movieData[i].Rated) && movieData[i].imdbRating > 6.0)
					here = 1;
			}
			if (here == 1)
				sim.push(movieData[i]);
		}

	});




	return sim;
}





//finds average of a given movie
function findAverage(movieTitle) {

    let fileName = path.join("jsonData/ratings/" + movieTitle);
    if (fs.existsSync(fileName)) {
        let data = fs.readFileSync(fileName);
        let movData = JSON.parse(data);
        let total = 0;

        let i;
        for (i = 0; i < movData.length; i++) {
            total = total + movData[i];
        }
        let avg = (total / i).toFixed(2);
        return avg;

    } else {
        console.log("Could not find average.");
    }


}

//BELOW HERE IS THE SEARCHING AREA



/* TESTING:::;
createActorList();
addActor("matthew");
editMovie("Jumanji", "Michael S", "matthew");
console.log(movieData[1]);
console.log(actors["Michael S"]);
console.log(actors["matthew"]);

works :)
*/
/*
*/