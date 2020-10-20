
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

var users = {};
var loggedIn = 0;  //0 for logged out, 1 for logged in 


//Set up the required data
let movieData = require("./movies.json");
let moviesAbove90 = [];


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
			getMostPopular;
			let content = renderMovies({moviesToShow: movieData});
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
		else if(request.url === "/js/navigation.js"){
			fs.readFile("js/navigation.js", function(err, data){
				if(err){
					send500(response);
					return;
				}
				response.statusCode = 200;
				response.end(data);
				return;
			});
		}

		else {
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




function getMostPopular(){
	for(let i =0; i< movieData.length; i++){
		if(movieData[i].imdbRating > 90){
			moviesAbove90.push(movieData[i]);
		}
	}

	console.log(moviesAbove90);
}



