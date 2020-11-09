
const http = require('http');
const pug = require('pug');
const fs = require("fs");
const express = require('express');
const app = express();


app.set("view engine","pug");


var loggedIn = 0;  //0 for logged out, 1 for logged in 
//Set up the required data
let movieData = require("./movies.json");
let moviesAbove70 = []; //gets list of popular movies (above 7,0 rating)
getMostPopular();

let movieGenres = [];
let movieActors = [];
let movieWriters = [];
let movieDirector;


let movieRatings = {};
createDictForRatings(); //creates dictionary for ratings

let actors = {};
cleanWriters();

let movieReviews = {};
createDictForReviews(); //creates dictionary for the reviews

//server initialization and router creation

/*let movieRouter = require("./routes/movie-router");
app.use("/movies/",movieRouter);
*/


//GETTING THE LANDING PAGES OF THE MAIN SERVER
app.get("/", (req,res,next) =>{
	res.render("pages/index");
});

app.get("/movies", (req,res,next) =>{
	res.render("pages/movies", { moviesToShow : moviesAbove70 });
});

app.get("/actors", (req,res,next) =>{
res.render("pages/actors");
});

app.get("/searchMovie", (req,res,next) =>{
	res.render("pages/searchMovie");
});


app.get("/selfProfile", (req,res,next) =>{
	res.render("pages/selfProfile");
});

//GETTING THE JAVASCRIPT FUNCTIONS FOR THE MAIN SERVER
app.get("/js/navigation.js", (req,res,next) =>{
	res.sendFile( __dirname + "/js/" + "navigation.js" );
});

/*let actorRouter = require("./routes/actor-router.js");
app.use("/actors", actorRouter);

let userRouter = require("./routes/user-router")
app.use("/users", userRouter);

});*/

app.listen(3000);
console.log("Server listening at http://localhost:3000.");






function generateUsers(){
	let users = {

		"1001": {
			name: "Cronk",
			password: "12345",
			likedMovies: ["Heat"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew"],
		},
	
		"1003": {
			name: "Michael",
			password: "2",
			likedMovies: ["Toy Story"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew"],
		},
	
		"1002": {
			name: "Mathew",
			password: "54321",
			likedMovies: ["Jumanji"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Michael"],
	
		}
	
	
	};
	//the key is their id
}


/*
FUNCTION: To get the most popular array of movies from the datbase based on reviews above 7
*/
function getMostPopular() {
	moviesAbove70 = [];
	//clears array at the start to ensure no constant addons
	for (let i = 0; i < movieData.length; i++) {
		if (movieData[i].imdbRating > 7) {
			moviesAbove70.push(movieData[i]);
		}
	}
}





//takes in movie data and creates an actor dictionary from it
/*
name : {
	movies: [array of movies the actor has acted in],
	actedWith: {
		actorName: occurenceAmount;	
	}
}
*/
function createActorList() {


	//for actors
	for (let i = 0; i < movieData.length; i++) {
		let temp = movieData[i].Actors.split(", ");
		let others = movieData[i].Writer.split(", ");
		let others2 = movieData[i].Director;
		for (let j = 0; j < temp.length; j++) {
			if (!(temp[j] in actors)) {  //if it doesnt exist before
				actors[temp[j]] = {
					name: temp[j],
					movies: [movieData[i].Title], //array to push to later
					actedWith: temp.concat(others, others2)

				};
			}


		}
	}


	//for writers
	for (let i = 0; i < movieData.length; i++) {
		let temp = movieData[i].Writer.split(", ");
		let others = movieData[i].Actors.split(", ");
		let others2 = movieData[i].Director;



		for (let j = 0; j < temp.length; j++) {

			if (!(temp[j] in actors)) {  //if it doesnt exist before
				actors[temp[j]] = {
					name: temp[j],
					movies: [movieData[i].Title], //array to push to later
					actedWith: temp.concat(others, others2)

				};
			}
		}

	}



	//for directors
	for (let i = 0; i < movieData.length; i++) {
		let temp = movieData[i].Director;
		let others = movieData[i].Writer.split(", ");
		let others2 = movieData[i].Actors.split(", ");

		if (!(temp in actors)) {  //if it doesnt exist before
			actors[temp] = {
				name: temp,
				movies: [movieData[i].Title], //array to push to later
				actedWith: temp.concat(others, others2)

			};
		}

	}

}
function createDictForReviews() {
	for (let i = 0; i < movieData.length; i++) {
		if (!(movieData[i].Title in movieReviews)) {
			movieReviews[movieData[i].Title] = [];/*{


				"1002": {
					name: "Michael",
					rating: 5,
					plotSummary: "To drop or not to drop. That is the question",
					review: "Crop top, drop top, this is hot mop"
				},

				"1001": {
					name: "Mathew",
					rating: 10,
					plotSummary: "I love this",
					review: "I love it so much."
				}


			}*/
		}
	}
}

function createDictForRatings() {

	for (let i = 0; i < movieData.length; i++) {
		if (!(movieData[i].Title in movieRatings)) {
			movieRatings[movieData[i].Title] = [5, 6];
		}
		//all movies start with a weighting of 5.5
	}
}






//script to clean up the writers json allowing it to be used easier 
//format removes all of the parentheses and info within them 

//also changes time
function cleanWriters() {

	for (let i = 0; i < movieData.length; i++) {
		let temp = movieData[i].Writer.split(",");
		let time = movieData[i].Runtime.split(" ");

		for (let j = 0; j < temp.length; j++) {
			if (temp[j].includes("("))
				temp[j] = temp[j].substr(0, temp[j].indexOf('('));
			temp[j] = temp[j].trim();

		}

		movieData[i].Runtime = time[0];
		movieData[i].Writer = temp.join(', ');
	}



}


function findAverage(givenArray) {

	let total = 0;


	for (let i = 0; i < givenArray.length; i++) {
		total = total + givenArray[i];
	}
	let avg = total / givenArray.length;
	return avg;
}


//BELOW HERE IS THE SEARCHING AREA



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




//createActorList();
//console.log("searching");
//console.log(searchForActors("Tom"));


//Functions to search for actors based on the name or part of it, returns actor objects
function searchForActors(name) {
	let possibleActors = [];

	for (element in actors) {
		if (element.includes(name)) {
			possibleActors.push(actors[element]);
		}
	}
	return possibleActors;
}


//console.log(searchForMovie(null,"Action",null,null,null));
//Function to search for movie based on name(string), genre (needs to be string), release year caps, and run time. Returns movie objects
function searchForMovie(name, genre, releaseYearMax, releaseYearMin, runTimeMax) {
	let possibleMovies = [];

	if (name == null)
		name = "";

	if (releaseYearMax == null)
		releaseYearMax = 30000;

	if (releaseYearMin == null)
		releaseYearMin = -100;

	if (runTimeMax == null)
		runTimeMax = 10000;

	if (genre == null)
		genre = "";

	for (let i = 0; i < movieData.length; i++) {
		if (movieData[i].Title.includes(name) && movieData[i].Year >= releaseYearMin && movieData[i].Year <= releaseYearMax && movieData[i].Runtime <= runTimeMax && movieData[i].Genre.includes(genre)) {
			possibleMovies.push(movieData[i]);
		}
	}

	return possibleMovies;
}


//console.log(movieData[1]);
//console.log(getSimilarMovies(movieData[1]));
//find similar movies based on genre
function getSimilarMovies(movie) {
	let sim = [];
	for (let i = 0; i < movieData.length; i++) {
		let temp = movieData[i].Genre.split(", ");
		let here = 0;


		for (let j = 0; j < temp.length; j++) {
			if (movie.Genre.includes(temp[j]) && movie.Rated === (movieData[i].Rated))
				here = 1;
		}
		if (here == 1)
			sim.push(movieData[i]);
	}

	return sim;
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


//adds an actor object to the actor dictionary
// does not allow adding if the actor already exists

function addActor(name) {
	if (!(name in actors)) {
		actors[name] = {
			movies: [],
			actedWith: []
		};
	}

	else
		console.log("Actor exists.");

}
/*createActorList();

addActor("Michael");
addActor("Tom Hanks");

console.log(actors["Michael"]);
console.log(actors["Tom Hanks"]);
TESTING PURPOSES
*/


function addMovie(title, poster, runtime, 
	released, genre, actorsArr, rated, writerArr, director, rating, plot	) {
	
	checkAct = actorsArr.split(",");
	checkWriter = writerArr.split(",");

	checkAct.forEach(element => {
		if(!element in actors)
			return false;
	});

	checkWriter.forEach(element => {
		if(!element in actors)
			return false;
	});


	let newMov = {
		Title : title,
		Poster : poster,
		Year : released,
		Rated : rated,
		Runtime : runtime,
		Genre : genre,
		Actors : actorsArr,
		Writers : writerArr,
		Director : director,
		imdbRating : rating,
		Plot : plot
	}

	movieData.push(newMov);

	createDictForRatings();
	createDictForReviews();
}
/*
TESTER: WORKS 
createActorList();

addMovie(
	"My movie", "#", "123", "1992", "Fantasy", "Tom Hanks, Sean Bean",
	"G", "Pete Docter", "Michael S", "9.2", "Great movie"
);
console.log(movieData[movieData.length-1]);
*/



function editMovie(title, actor, writer) {

	
	for (let i = 0; i < movieData.length; i++) {

		if (movieData[i].Title === title) {
			console.log(title);
			if (actor !== ""){
				actors[actor].movies.push(title);
				movieData[i].Actors += (", " + actor);
				//need to add to dictionary of ppl worked with
			}
			if (writer !== ""){
				movieData[i].Writer.concat(writer);
				actors[writer].movies.push(title);
				//need to add to dictionary of people worked with
			}
		}


	}
}
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