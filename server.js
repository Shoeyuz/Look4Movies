
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


var users = {};		//dictionary to store users
var loggedIn = 0;  //0 for logged out, 1 for logged in 


//Set up the required data
let movieData = require("./movies.json");
let moviesAbove70 = [];

let movieGenres = [];
let movieActors = [];
let movieWriters = [];
let movieDirector;
//Helper function to send a 404 error
function send404(response){
	response.statusCode = 404;
	response.write("Unknown resource.");
	response.end();
}

//Helper function to send a 500 error
function send500(response){
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

		else if(request.url === "/movies"){
			getMostPopular();
			let content = renderMovies({moviesToShow: moviesAbove70});
			response.statusCode = 200;
			response.end(content);
			return;
		}

		else if(request.url === "/actors"){
			let content = renderActors();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if(request.url === "/genres"){
			let content = renderGenres();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if(request.url === "/searchMovie"){
			let content = renderSearchMovie();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if(request.url === "/selfProfile"){
			let content = renderSelfProfile();
			response.statusCode = 200;
			response.end(content);
			return;
		}
		else if (request.url.startsWith("/movies/")) {
			movieGenres = []; //clearing array for fresh start
			movieActors = [];
			movieWriters = [];
			movieDirector = null;

			let mov = request.url.slice(8);  
			mov = decodeURI(mov); //IMPORTANT TO GET RID OF URI ENCODING. A space is saved as a %20 for example
			try {
				//this looks for the movie to check if it exists
				movieData.forEach(element => {
					if(element.Title === mov){
					movieGenres = element.Genre.split(', ');
					movieActors = element.Actors.split(', ');
					movieWriters = element.Writer.split(', ');
					movieDirector = element.Director;
					found = true;
					}
				});
				
				if (found) {
					
					//if card found return whole object
					let movieToSend = movieData.find(element => element.Title == mov);

					//THIS CALLS THE MOVIE TO THE PUG TEMPLATE
					let content = renderSingleMovie({ singleMovie: movieToSend, genres: movieGenres, actors: movieActors, writers: movieWriters, director: movieDirector});
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
		}else if(request.url.startsWith("/actors/")){
			let act = request.url.slice(8);  
			act = decodeURI(act);
			console.log(act);


		}else if(request.url === "/js/navigation.js"){
			fs.readFile("js/navigation.js", function(err, data){
				if(err){
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		}else if(request.url === "/js/reviewRate.js"){
			fs.readFile("js/reviewRate.js", function(err, data){
				if(err){
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		}else {
			response.statusCode = 404;
			response.write("Unknwn resource.");
			response.end();
	
		}
		
	}else if (request.method === "POST") {


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
function getMostPopular(){
	moviesAbove70 = [];
	//clears array at the start to ensure no constant addons
	for(let i =0; i< movieData.length; i++){
		if(movieData[i].imdbRating > 7){
			moviesAbove70.push(movieData[i]);
		}
	}
}



