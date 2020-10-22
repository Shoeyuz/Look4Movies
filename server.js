
const http = require('http');
const pug = require('pug');
const fs = require("fs");

const renderIndex = pug.compileFile('Views/pages/index.pug');
const renderMovies = pug.compileFile('Views/pages/movies.pug');
const renderActors = pug.compileFile('Views/pages/actors.pug');
const renderGenres = pug.compileFile('Views/pages/genres.pug');
const renderSearchMovie = pug.compileFile('Views/pages/searchMovie.pug');
const renderSelfProfile = pug.compileFile('Views/pages/selfProfile.pug');
const renderSingleMovie = pug.compileFile('Views/pages/movieSingle.pug');
const renderSingleActor = pug.compileFile('Views/pages/actorSingle.pug');


var loggedIn = 0;  //0 for logged out, 1 for logged in 


//Set up the required data
let movieData = require("./movies.json");
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
		name: "Michael",
		password: "12345",
		likedMovies: ["Heat"],
		subscribedActors: ["Sean Bean"],
		subscribedUsers: ["Mathew"],
		recommendedMovie: ["Toy Story"]
	},

	"1003": {
		name: "Michael",
		password: "2",
		likedMovies: ["Toy Story"],
		subscribedActors: ["Sean Bean"],
		subscribedUsers: ["Mathew"],
		recommendedMovie: ["Heat"]
	},

	"1002": {
		name: "Mathew",
		password: "54321",
		likedMovies: ["Jumanji"],
		subscribedActors: ["Sean Bean"],
		subscribedUsers: ["Michael"],
		recommendedMovie: ["Toy Story"]

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
			let thisReviews = {};
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



		} else if (request.url.startsWith("/actors/")) {
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
				//name: temp,
				movies: [movieData[i].Title], //array to push to later
				actedWith: temp.concat(others, others2)

			};
		}

	}

}
function createDictForReviews() {
	for (let i = 0; i < movieData.length; i++) {
		if (!(movieData[i].Title in movieReviews)) {
			movieReviews[movieData[i].Title] = {


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


			}
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

function search() {
	//searches for writer/actor/director or for a movie
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
		if (users[element].includes(name)) {
			possibleUsers.push(element);
		}
	}

	return possibleUsers;
}



/*
createActorList();
console.log(searchForActors("Tom"));
*/

//Functions to search for actors based on the name or part of it, returns actor objects
function searchForActors(name) {
	let possibleActors = [];

	for (element in actors) {
		if (element.includes(name)) {
			possibleActors.push(element);
		}
	}
	return possibleActors;
}



//console.log(searchForMovie("a",null,null,105));
//Function to search for movie based on name, release year caps, and run time. Returns movie objects
function searchForMovie(name, releaseYearMax, releaseYearMin, runTimeMax) {
	let possibleMovies = [];

	if (name == null)
		name = "";

	if (releaseYearMax == null)
		releaseYearMax = 30000;

	if (releaseYearMin == null)
		releaseYearMin = -100;

	if (runTimeMax == null)
		runTimeMax = 10000;


	for (let i = 0; i < movieData.length; i++) {
		if(movieData[i].Title.includes(name) && (movieData[i].Year >= releaseYearMin && movieData[i].Year <= releaseYearMax) && movieData[i].Runtime <= runTimeMax){
			possibleMovies.push(movieData[i]);
		}
	}

	return possibleMovies;
}