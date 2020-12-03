
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
/*
app.use(function (req, res, next) {
	console.log("-------------------------");
	console.log("Request Method: " + req.method);
	console.log("Request URL: " + req.url);
	console.log("Request PATH: " + req.path);
	console.log("Request Session: " + req.session);
	console.log("Request user: " + req.session.user);

	console.log(req.session)

	console.log();
	next();
});*/



let moviesAbove70 = []; //gets list of popular movies (above 7,0 rating)
//server initialization and router creation

let movieRouter = require("./routes/movie-router");
app.use("/movies/", movieRouter);


let actorRouter = require("./routes/actor-router");
app.use("/people/", actorRouter);


let userRouter = require("./routes/user-router");
const { EMLINK } = require('constants');
const { post } = require('./routes/user-router');
app.use("/users/", userRouter);


//GETTING THE LANDING PAGES OF THE MAIN SERVER
app.get("/", (req, res, next) => {
	res.render("pages/index", { loggedIn: req.session.loggedIn });
});

app.get("/movies", (req, res, next) => {
	res.format({
		"application/json": function () {
			let movName = req.query.title;
			let movGenre = req.query.genre;
			let movMax = req.query.year;
			let movMin = req.query.year;
			let rate = req.query.minRating;
			if(movMax === ""){
				movMax = null;
			}
			if(movMin === ""){
				movMin = null;
			}

			let posMov = searchForMovie(movName, movGenre, movMax, movMin, rate);

			res.status(200).json(posMov);
		},
		"text/html": function () {
			getMostPopular();
			res.render("pages/movies", { loggedIn: req.session.loggedIn, moviesToShow: moviesAbove70, contributing: req.session.contributor });
		}
	});

});
app.get("/users", (req,res,next) =>{
	res.format({
		"application/json": function () {
			let name = req.query.name;
			let posUsers = searchForUser(name);
			res.status(200).json(posUsers);
		}
		
	});
});
app.get("/people", (req, res, next) => {
	res.format({
		"application/json": function () {
			let name = req.query.name;
			let posActors = searchForActors(name);
			res.status(200).json(posActors);
		},
		"text/html": function () {
			res.render("pages/actors", { loggedIn: req.session.loggedIn, contributing: req.session.contributor });

		}
	});
	
});

app.get("/search", (req, res, next) => {
	res.render("pages/searchMovie", { loggedIn: req.session.loggedIn });
});

app.get("/profile", (req, res, next) => {

	let fileName = path.join("jsonData/users/", req.session.user);
	console.log(fileName);
	if (fs.existsSync(fileName)) {
		let data = fs.readFileSync(fileName);
		req.user = JSON.parse(data);
		let uReviews = [];
		res.render("pages/selfProfile", { uReviews, loggedIn: req.session.loggedIn, other: false, user: req.user, recommendations: req.user.likedMovies });
		res.status(200);
	} else {
		res.status(404).send("Something went wrong trying to find the profile for this user.");
	}

});

app.get("/searchMovie?", (req, res, next) => {

	let movName = req.query.name;
	let movGenre = req.query.genre;
	let movMax = req.query.yearMax;
	let movMin = req.query.yearMin;

	let rate = req.query.minRating;


	let posMov = searchForMovie(movName, movGenre, movMax, movMin, rate);

	

	res.render("pages/searchMovieResults", { loggedIn: req.session.loggedIn, movies: posMov })
});


app.get("/searchPeople?", (req, res, next) => {
	let name = req.query.name;
	let posActors = searchForActors(name);

	res.render("pages/searchActorResults", { loggedIn: req.session.loggedIn, people: posActors });
});


app.get("/searchUsers?", (req, res, next) => {
	let name = req.query.name;

	let posUsers = searchForUser(name);

	res.render("pages/searchUserResults", { loggedIn: req.session.loggedIn, people: posUsers })
});

app.post("/movies", [express.json(), addMovie]); 
function addMovie(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
		console.log(postData);
        postData = JSON.parse(postData);
        const title = postData[0];
        const rated = postData[1];
        const plot = postData[2];
        const actors = postData[3];
        const writers = postData[4];
        const director = postData[5];
        const runtime = postData[6];
        const release = postData[7];
        const genres = postData[8];
        const releaseYear = postData[9];
        const imageUrl = postData[10];
        let movie = {
            Title: title,
            Rated: rated,
            Plot: plot,
            Actors: actors,
            Writer: writers,
            Director: director,
            Runtime: runtime,
            Released: release,
            Genre: genres,
            Year: releaseYear,
            Poster: imageUrl
        }


        let fileName = path.join("jsonData/movies/" + postData[0]);



        if (!fs.existsSync(fileName)) {

            //adds all people to actors acted with
            let tempWriter = writers.split(", ");
            tempWriter.forEach(writer => {

                let fileName = path.join("jsonData/people/", writer);
                if (!fs.existsSync(fileName)) {
                    console.log("no such person exists to add");
                    res.status(404);
                    next();
                }
                else {

                    var actor;
                    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {

                        if (err) {
                            console.log("Something went wrong with writers");
                        }
                        else {
                            actor = JSON.parse(data);
                            actor.movies.push(title);
                            let temp = writers.split(", ");
                            temp.forEach(element => {
                                actor.actedWith.push(element);

                            });
                            temp = actors.split(", ");
                            temp.forEach(element => {
                                actor.actedWith.push(element);

                            });
                            temp = director.split(", ");
                            temp.forEach(element => {
                                actor.actedWith.push(element);

                            });


                            fs.writeFile(fileName, JSON.stringify(actor), function (err) {
                                if (err) {
                                    console.log("Error saving person.");
                                    console.log(err);
                                } else {
                                    console.log("Person saved.");
                                }
                            });


                        }



                    });

                }
            });


            //for actor
            let tempActor = actors.split(", ");
            tempActor.forEach(actor => {

                let fileName = path.join("jsonData/people/", actor);
                if (!fs.existsSync(fileName)) {
                    console.log("no such person exists to add");
                    res.status(404);
                    next();
                }
                else {
                    var info;
                    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
                        if (err) {
                            console.log("Something went wrong with the actors")
                        }
                        else {
                            info = JSON.parse(data);
                            info.movies.push(title);
                            let temp = writers.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });
                            temp = actors.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });
                            temp = director.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });


                            fs.writeFile(fileName, JSON.stringify(info), function (err) {
                                if (err) {
                                    console.log("Error saving person.");
                                    console.log(err);
                                } else {
                                    console.log("Person saved.");
                                }
                            });
                        }

                    });

                }


            });
            //for director
            let dir = director.split(", ");
            dir.forEach(person => {

                let fileName = path.join("jsonData/people/", person);
                if (!fs.existsSync(fileName)) {
                    console.log("no such person exists to add");
                    res.status(404);
                    next();
                }
                else {
                    let data = "";
                    var info;
                    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
                        if (err) {
                            console.log("Something went wrong with the actors")
                        }
                        else {
                            info = JSON.parse(data);
                            info.movies.push(title);
                            let temp = writers.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });
                            temp = actors.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });
                            temp = director.split(", ");
                            temp.forEach(element => {
                                info.actedWith.push(element);

                            });


                            fs.writeFile(fileName, JSON.stringify(info), function (err) {
                                if (err) {
                                    console.log("Error saving person.");
                                    console.log(err);
                                } else {
                                    console.log("Person saved.");
                                }
                            });
                        }


                    });






                }
            });
            fileName = path.join("jsonData/movies/" + postData[0]);

            fs.writeFileSync(fileName, JSON.stringify(movie), function (err) {
                if (err) {
                    console.log("Error saving movie.");
                    console.log(err);
                } else {
                    console.log("Movie saved.");
                }
            });

            let arr = [0];
            fs.writeFileSync("jsonData/ratings/" + postData[0], JSON.stringify(arr), function (err) {
                if (err) {
                    console.log("Error saving person.");
                    console.log(err);
                } else {
                    console.log("Movie saved.");
                }
            });
            arr = [];
            fs.writeFileSync("jsonData/reviews/" + postData[0], JSON.stringify(arr), function (err) {
                if (err) {
                    console.log("Error saving person.");
                    console.log(err);
                } else {
                    console.log("Movie saved.");
                }
            });
            res.status(200);
            next();
        }

        else {
            console.log("This movie already exits");
            res.status(404);
            next();
        }
    });
}
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
app.get("/js/unsubActor.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "unsubActor.js");
});
app.get("/js/unfollow.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "unfollow.js");
});
app.get("/js/followUser.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "followUser.js");
});
app.get("/js/editMovie.js", (req, res, next) => {
	res.sendFile(__dirname + "/js/" + "editMovie.js");
});






//app.listen(3000); change back later
app.listen(process.env.PORT || 3000);
console.log("Server listening at http://localhost:" + (process.env.PORT || 3000));


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
	const readFolder = 'jsonData/users/';


	fs.readdirSync(readFolder).forEach(file => {
		let data = fs.readFileSync(readFolder + file);
		let useData = JSON.parse(data);
		if (useData.name.toLowerCase().includes(name.toLowerCase())) {
			useData.password=[];
			possibleUsers.push(useData);

		}
	});


	return possibleUsers;
}

//Functions to search for actors based on the name or part of it, returns actor objects
function searchForActors(name) {
	let possibleActors = [];




	const readFolder = 'jsonData/people/';


	fs.readdirSync(readFolder).forEach(file => {
		let data = fs.readFileSync(readFolder + file);
		let actData = JSON.parse(data);
		if (actData.name.toLowerCase().includes(name.toLowerCase())) {
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
		if (movData.Title.toLowerCase().includes(name.toLowerCase()) && movData.Year >= releaseYearMin && movData.Year <= releaseYearMax && movData.Genre.includes(genre)) {
			if (findAverage(movData.Title) >= rateMin) {
				movData.rating = findAverage(movData.Title);
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

