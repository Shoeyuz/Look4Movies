const express = require('express');
const path = require('path');
let router = express.Router();
const fs = require("fs");
const bodyParser = require('body-parser');
const { post } = require('./movie-router');
const { callbackify } = require('util');




router.get("/:name", [getActor, sendSingleActor]);
router.post("/submit", [express.json(), addActor]);

//Load an actor and add actor property to the 
// request object based on actor name request parameter
function getActor(req, res, next) {
    //Get the id parameter
    let nameActor = req.params.name;
    nameActor = nameActor.trim();

    let fileName = path.join("jsonData/people/" + nameActor);
    //If the movie exists, load it, parse object
    // and add the movie property to the request before
    // calling next middleware
    if (fs.existsSync(fileName)) {

        let data = fs.readFileSync(fileName);
        req.actor = JSON.parse(data);
        next();
    } else {
        res.status(404).send("Could not find person.");
    }
}
//Send the representation of a single actor that is a property of the request object
//Sends either JSON or HTML, depending on Accepts header
function sendSingleActor(req, res, next) {
    res.format({
        "application/json": function () {
            res.status(200).json(req.actor);
        },
        "text/html": function () {
            let actor = req.actor;

            let actorMovies = [];


            actor.movies.forEach(movieIn => {
                let fileName = path.join("jsonData/movies/" + movieIn);


                if (fs.existsSync(fileName)) {

                    let data = fs.readFileSync(fileName);
                    req.movie = JSON.parse(data);
                    actorMovies.push(req.movie);

                } else {
                    res.status(404).send("Could not find movie.");
                }
            });



            //organizes by most acted with
            let freq = {};
            let actWith = [];

            actor.actedWith.forEach(element => {
                if(freq[element] == null){
                    freq[element] = 1;
                }
                else{
                    freq[element]++;
                }
            });
            let max = 0;
            let actorCommon;
            //loops 5 times to give the top 5 in dictionary
            //NOT ALLOWING OWN NAME IN
            for(let i = 0; i<5; i++){
                for(var act in freq){
                    //doesn account for duplicates if two actors at 5
                    if(freq[act]>=max && actWith.indexOf(act) === -1 && act != actor.name){
                        actorCommon = act;
                        max = freq[act];
                    }
                }
                max = 0;
                actWith.push(actorCommon);
            }
           

            




            let nameActor = actor.name;

            let following;
            if(req.session.loggedIn){

                fileName = path.join("jsonData/users/" + req.session.user);
                fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
                    if (err) {
                        console.log("Something went wrong with reading the user following.");
                        return false;
                    }
    
                    else {
    
                        user = JSON.parse(data);
                        
                        following = false;
                        user.subscribedActors.forEach(element => {
    
                            if (element === nameActor) {
                                console.log("Found " + nameActor);
                                following = true;
    
                            }                              
                        });
    
                    }
                    processFile(following);
    
                });
            }

            else{
                processFile(false);
            }
            function processFile(following){
                res.render("pages/actorSingle", { following, loggedIn: req.session.loggedIn, moviesToShow: actorMovies, coworkers: actWith, name: nameActor });
                next();
            }
        }
    });

}


//adds an actor object to the actor folder
// does not allow adding if the actor already exists
function addActor(req, res, next) {
    console.log("adding actor");
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);
        console.log(postData[0]);
        let fileName = path.join("jsonData/people/" + postData[0]);

        if (!fs.existsSync(fileName)) {
            let data = {
                name: postData[0],
                movies: [],
                actedWith: []
            }

            fs.writeFile(fileName, JSON.stringify(data), function (err) {
                if (err) {
                    console.log("Error saving person.");
                    console.log(err);
                } else {
                    console.log("Person saved.");
                }
            })
            res.status(200);
            next();
        }

        else {
            console.log("This person exits");
            res.status(404);
            next();
        }
    });

}




module.exports = router;