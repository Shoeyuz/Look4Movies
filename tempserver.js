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
			let rec = getRecommendedMovie(users["1001"].likedMovies);
			console.log(rec);
			let content = renderSelfProfile({ user: users["1001"], recommendations: rec });
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
