const express = require('express');
const path = require('path');
let router = express.Router();
const fs = require("fs");
const bodyParser = require('body-parser');
const { json } = require('express');
const session = require('express-session');
router.use(session({ secret: 'someSecret' }));


router.use(bodyParser.json());


let avg;

//router.put("/:title", express.json(), editMovie);

router.get("/:title", [getMovie, sendSingleMovie]);
router.put("/:title/rate", [express.json(), saveRating]);
router.put("/:title/review", [express.json(), saveReview]);
router.post("/newMovie", [express.json(), addMovie]);
router.put("/:title/edit", [express.json(), editMovie]);
//Load a movie and add a movie property to the 
// request object based on movie title request parameter
function getMovie(req, res, next) {
    //Get the id parameter
    let titleMovie = req.params.title;
    let fileName = path.join("jsonData/movies/" + titleMovie);
    //If the movie exists, load it, parse object
    // and add the movie property to the request before
    // calling next middleware
    if (fs.existsSync(fileName)) {

        let data = fs.readFileSync(fileName);
        req.movie = JSON.parse(data);
        next();
    } else {
        res.status(404).send("Could not find movie.");
    }
}
//Send the representation of a single user that is a property of the request object
//Sends either JSON or HTML, depending on Accepts header
function sendSingleMovie(req, res, next) {
    res.format({
        "application/json": function () {
            //get the reviews
            let movie = req.movie;

            let fileName = path.join("jsonData/reviews/" + movie.Title);

            if (fs.existsSync(fileName)) {

                let data = fs.readFileSync(fileName);
                req.reviews = JSON.parse(data);
            } else {
                res.status(404).send("Could not find movie review.");
            }
            thisReviews = req.reviews;
            req.movie.reviews = thisReviews;
            res.status(200).json(req.movie);
        },
        "text/html": function () {
            let movie = req.movie;

            let movieGenres = movie.Genre.split(',');
            let movieActors = movie.Actors.split(',');
            let movieWriters = movie.Writer.split(',');
            let movieDirector = movie.Director;


            //gets the reviews of the movies
            let fileName = path.join("jsonData/reviews/" + movie.Title);

            if (fs.existsSync(fileName)) {

                let data = fs.readFileSync(fileName);
                req.reviews = JSON.parse(data);
            } else {
                res.status(404).send("Could not find movie review.");
            }
            thisReviews = req.reviews;

            //gets the average rating of the movie based on user input
            userRatings = findAverage(movie.Title);
            thisSimilar = getSimilarMovies(movie);
            res.render("pages/movieSingle", { user: req.session.user, loggedIn: req.session.loggedIn, contributing: req.session.contributor, moviesToShow: thisSimilar, uReviews: thisReviews, uRating: userRatings, singleMovie: movie, genres: movieGenres, actors: movieActors, writers: movieWriters, director: movieDirector });
            res.status(200);
        }
    });

    next();
}


function saveRating(req, res, next) {
    let titleMovie = req.params.title;
    let fileName = path.join("jsonData/ratings/" + titleMovie);
    //Only update the ratings if there is already a ratings section for movie
    // with the specified title
    if (fs.existsSync(fileName)) {
        let postData = "";
        let rating;

        let data = fs.readFileSync(fileName);
        data = JSON.parse(data)



        req.on("data", chunk => postData += chunk);

        req.on("end", () => {
            postData = JSON.parse(postData);


            rating = Number(postData[0]);
            console.log(rating);
            data.push(rating);


            fs.writeFile(fileName, JSON.stringify(data), function (err) {
                if (err) {
                    console.log("Error saving ratings.");
                    console.log(err);
                } else {
                    console.log("Rating saved.");
                }
            });


            res.status(200);
            next();

        });




        //fs.writeFileSync(fileName,JSON.stringify(listR));
    } else {
        res.status(404).send("Could not find movie to add rating for.");
    }
}

function saveReview(req, res, next) {
    let titleMovie = req.params.title;
    let fileName = path.join("jsonData/reviews/" + titleMovie);


    if (fs.existsSync(fileName)) {
        let postData = "";

        let data = fs.readFileSync(fileName);
        data = JSON.parse(data)


        req.on("data", chunk => postData += chunk);

        req.on("end", () => {
            postData = JSON.parse(postData);

            let rate = Number(postData[1]);
            let plotSum = (postData[2]);
            let rev = (postData[3]);
            let id = req.session.user;


            let finalReview = {

                id: {
                    name: id,
                    rating: rate,
                    plotSummary: plotSum,
                    review: rev
                }
            };

            data.push(finalReview);

            fs.writeFile(fileName, JSON.stringify(data), function (err) {
                if (err) {
                    console.log("Error saving review.");
                    console.log(err);
                } else {
                    console.log("Review saved.");
                }
            })

            let revie = fs.readFileSync("jsonData/users/" + req.session.user);

            revie = JSON.parse(revie);
            revie.reviews.push(finalReview);
            fs.writeFile("jsonData/users/" + req.session.user, JSON.stringify(revie), function (err) {
                if (err) {
                    console.log("Error saving review.");
                    console.log(err);
                } else {
                    console.log("Review saved.");
                }
            })

            res.status(200);
            next();



        });




        //fs.writeFileSync(fileName,JSON.stringify(listR));
    } else {
        res.status(404).send("Could not find movie to add review for.");
    }
}

function addMovie(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
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

function editMovie(req, res, next) {
    let title = req.params.title;
    let fileName = path.join("jsonData/movies/" + title);

    if (fs.existsSync(fileName)) {
        let postData = "";

        let data = fs.readFileSync(fileName);
        data = JSON.parse(data)

        req.on("data", chunk => postData += chunk);

        req.on("end", () => {
            postData = JSON.parse(postData);

            let actors = (postData[0]);
            let writers = (postData[1]);


            tempAct = actors.split(", ");
            tempWriter = writers.split(", ");

            tempAct.forEach(element => {
                data.Actors += (", " + element)
            });

            tempWriter.forEach(element => {
                data.Writer += (", " + element)
            });


            fs.writeFile(fileName, JSON.stringify(data), function (err) {
                if (err) {
                    console.log("Error saving edit.");
                    console.log(err);
                } else {
                    console.log("Edit saved.");
                }
            });

            data.Writer.split(", ")
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

            res.status(200);
            next();



        });




        //fs.writeFileSync(fileName,JSON.stringify(listR));
    } else {
        res.status(404).send("Could not find movie to add review for.");
    }
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



//console.log(movieData[1]);
//console.log(getSimilarMovies(movieData[1]));
//find similar movies based on genre
function getSimilarMovies(movie) {
    let sim = [];
    const readFolder = 'jsonData/movies/';

    fs.readdirSync(readFolder).forEach(file => {
        let data = fs.readFileSync(readFolder + file);
        let movData = JSON.parse(data);
        if (movie.Genre.includes(movData.Genre) && movie.Rated === (movData.Rated) && movData.Title !== movie.Title) {
            sim.push(movData);
        }
    });
    //console.log(sim);

    return sim;
}
module.exports = router;