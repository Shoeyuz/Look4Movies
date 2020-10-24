
const http = require('http');
const pug = require('pug');
const fs = require("fs");

const renderIndex = pug.compileFile('Views/pages/index.pug');
const renderMovies = pug.compileFile('Views/pages/movies.pug');
const renderActors = pug.compileFile('Views/pages/actors.pug');
const renderSearchMovie = pug.compileFile('Views/pages/searchMovie.pug');
const renderSelfProfile = pug.compileFile('Views/pages/selfProfile.pug');
const renderSingleMovie = pug.compileFile('Views/pages/movieSingle.pug');
const renderSingleActor = pug.compileFile('Views/pages/actorSingle.pug');

const renderSearchResultsActors = pug.compileFile('Views/pages/searchActorResults.pug');
const renderSearchResultsUsers = pug.compileFile('Views/pages/searchUserResults.pug');
const renderSearchResultsMovies = pug.compileFile('Views/pages/searchMovieResults.pug');


var loggedIn = 0;  //0 for logged out, 1 for logged in 


//Set up the required data
let movieData = require("./movies.json");
const { create } = require('domain');
let moviesAbove70 = []; //gets list of popular movies (above 7,0 rating)

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

//Helper function to send a 404 error
function send404(response) {
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

//Helper function to send a 500 error
function send500(response) {
	response.statusCode = 500;
	response.write("Server error.");
	response.end();
}


//Initialize server
const server = http.createServer(function (request, response) {
	createActorList();


	if (request.method === "GET") {
		if (request.url === "/index.html" || request.url === "/") {
			let content = renderIndex();
			response.statusCode = 200;
			response.end(content);
			return;

		}

		else if (request.url === "/movies") {
			getMostPopular();
			let content = renderMovies({ moviesToShow: moviesAbove70 });
			response.statusCode = 200;
			response.end(content);
			return;
		}

		else if (request.url === "/actors") {
			let content = renderActors();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if (request.url === "/genres") {
			let content = renderGenres();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if (request.url === "/searchMovie") {
			let content = renderSearchMovie();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if (request.url === "/selfProfile") {
			let content = renderSelfProfile({ user: users["1001"] });
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if (request.url.startsWith("/movies/")) {
			movieGenres = []; //clearing array for fresh start
			movieActors = [];
			movieWriters = [];
			movieDirector = null;
			let userRatings = 0;
			let thisReviews = [];
			let mov = request.url.slice(8);
			mov = decodeURI(mov); //IMPORTANT TO GET RID OF URI ENCODING. A space is saved as a %20 for example
			try {
				//this looks for the movie to check if it exists
				movieData.forEach(element => {
					if (element.Title === mov) {
						movieGenres = element.Genre.split(',');
						movieActors = element.Actors.split(',');
						movieWriters = element.Writer.split(',');
						movieDirector = element.Director;

						thisReviews = movieReviews[element.Title];
						console.log(thisReviews);

						userRatings = findAverage((movieRatings[element.Title]));

						found = true;
					}
				});



				if (found) {

					//if card found return whole object
					let movieToSend = movieData.find(element => element.Title == mov);

					//THIS CALLS THE MOVIE TO THE PUG TEMPLATE
					let content = renderSingleMovie({ uReviews: thisReviews, uRating: userRatings, singleMovie: movieToSend, genres: movieGenres, actors: movieActors, writers: movieWriters, director: movieDirector });
					response.statusCode = 200;
					response.end(content);
					return;
				} else {
					send404(response);
					return;
				}
			} catch (err) {
				console.log(err);
				console.log("Exception finding movie");
				send404(response);
				return;
			}
		} else if (request.url.startsWith("/profile/")) {
			let act = request.url.slice(8);
			act = decodeURI(act);
			act = act.trim();
			createActorList();


			try {
				//this looks for the actor to check if it exists
				if (act in actors) {
					let actorMovies = [];

					for (let i = 0; i < movieData.length; i++) {
						for (let j = 0; j < actors[act].movies.length; j++) {
							if (movieData[i].Title === actors[act].movies[j])
								actorMovies.push(movieData[i]);

						}
					}
					let actWith = actors[act].actedWith;
					let nameActors = act;
					let content = renderSingleActor({ moviesToShow: actorMovies, coworkers: actWith, name: nameActors });
					response.statusCode = 200;
					response.end(content);
					return;
				}
				else {
					send404(response);
					return;
				}
			}
			catch (err) {
				console.log(err);
				console.log("Exception finding actor");
				send404(response);
				return;
			}



		} else if (request.url.startsWith("/searchActor?")) {

			let mov = request.url.slice(13);
			mov.split["="];
			mov = mov.substr(mov.indexOf("=") + 1);

			let possibleActs = [];

			possibleActs = searchForActors(mov);

			try {
				//this looks for the actor to check if it exists
				if (possibleActs != []) {

					let content = renderSearchResultsActors({ people: possibleActs });
					response.statusCode = 200;
					response.end(content);
					return;
				}
				else {
					let content = renderSearchResultsActors({ people: possibleActs });
					response.statusCode = 200;
					response.end(content);
					return;
				}
			}
			catch (err) {
				console.log(err);
				console.log("Exception finding actor");
				send404(response);
				return;
			}


		} else if (request.url.startsWith("/searchUser?")) {

			let mov = request.url.slice(12);
			mov.split["="];
			mov = mov.substr(mov.indexOf("=") + 1);

			let possibleUsers = [];
			console.log(mov);

			possibleUsers = searchForUser(mov);

			try {
				//this looks for the actor to check if it exists
				if (possibleUsers != []) {

					let content = renderSearchResultsUsers({ people: possibleUsers });
					response.statusCode = 200;
					response.end(content);
					return;
				}
				else {
					let content = renderSearchResultsUsers({ people: possibleUsers });
					response.statusCode = 200;
					response.end(content);
					return;
				}
			}
			catch (err) {
				console.log(err);
				console.log("Exception finding user");
				send404(response);
				return;
			}


		} else if (request.url.startsWith("/searchMovie?")) {

			let mov = request.url.slice(13);
			let querries = mov.split("&");

			querries[0] = decodeURI(querries[0]);



			let posMov = [];
			posMov = searchForMovie(querries[0], querries[1], querries[2], querries[3], null);
			//console.log(querries[4]);

			let content = renderSearchResultsMovies({ movies: posMov });
			response.statusCode = 200;
			response.end(content);
			return;


		} else if (request.url.startsWith("/actors/")) {
			let act = request.url.slice(8);
			act = decodeURI(act);
			act = act.trim();
			//createActorList();


			try {
				//this looks for the actor to check if it exists
				if (act in actors) {
					let actorMovies = [];

					for (let i = 0; i < movieData.length; i++) {
						for (let j = 0; j < actors[act].movies.length; j++) {
							if (movieData[i].Title === actors[act].movies[j])
								actorMovies.push(movieData[i]);

						}
					}
					let actWith = actors[act].actedWith;
					let nameActors = act;
					let content = renderSingleActor({ moviesToShow: actorMovies, coworkers: actWith, name: nameActors });
					response.statusCode = 200;
					response.end(content);
					return;
				}
				else {
					send404(response);
					return;
				}
			}
			catch (err) {
				console.log(err);
				console.log("Exception finding actor");
				send404(response);
				return;
			}



		} else if (request.url === "/js/navigation.js") {
			fs.readFile("js/navigation.js", function (err, data) {
				if (err) {
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		} else if (request.url === "/js/reviewRate.js") {
			fs.readFile("js/reviewRate.js", function (err, data) {
				if (err) {
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		} else if (request.url === "/js/singleActor.js") {
			fs.readFile("js/singleActor.js", function (err, data) {
				if (err) {
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		} else if (request.url === "/js/selfProfile.js") {
			fs.readFile("js/selfProfile.js", function (err, data) {
				if (err) {
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		} else if (request.url === "/js/searchMovie.js") {
			fs.readFile("js/searchMovie.js", function (err, data) {
				if (err) {
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		} else {
			response.statusCode = 404;
			response.write("Unknwn resource.");
			response.end();

		}

	} else if (request.method === "POST") {

		if (request.url === "/submitRate") {
			let postData = "";

			request.on("data", chunk => postData += chunk);

			request.on("end", () => {
				postData = JSON.parse(postData);

				//console.log(postData);
				let title = postData[0];
				let rating = Number(postData[1]);
				//this converts the given string into a number

				movieRatings[title].push(rating);
				//this changes the movie rating array for that movie


				response, statusCode = 200;
				response.end(0);



			});
		}

		if (request.url === "/submitReview") {
			let postData = "";

			request.on("data", chunk => postData += chunk);


			request.on("end", () => {
				postData = JSON.parse(postData);

				console.log(postData);
				let title = postData[0];
				let rate = Number(postData[1]);
				let plotSum = (postData[2]);
				let rev = (postData[3]);
				let id = (postData[4]);


				let finalReview = {

					id: {
						name: "Michael",
						rating: rate,
						plotSummary: plotSum,
						review: rev
					}
				};


				movieReviews[title].push(finalReview);
				//this changes the movie rating array for that movie


				response, statusCode = 200;
				response.end(0);



			});
		}

	}
	else {
		response.statusCode = 404;
		response.write("Unknwn resource.");
		response.end();

	}
});

//Start server
server.listen(3000);
console.log("Server listening at http://localhost:3000");


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


function generateSimilarMovie() {
	//generates similar movies for the given movie
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


function addMovie(title, poster, runtime, released, genre, actors, writers, director, rating,) {

}

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


works :)
*/

createActorList();
addActor("matthew");
editMovie("Jumanji", "Michael S", "matthew");
console.log(movieData[1]);
console.log(actors["Michael S"]);
console.log(actors["matthew"]);