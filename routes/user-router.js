const express = require('express');
const path = require('path');
let router = express.Router();
const fs = require("fs");
const bodyParser = require('body-parser');
const { json } = require('express');
const session = require('express-session');
router.use(session({ secret: 'someSecret' }));



router.use(bodyParser.json());



router.post("/login", [express.json(), login]);
router.post("/signUp", [express.json(), signup]);
router.get("/logout", logout);


router.get("/upgrade", upgrade);
router.get("/:name", otherProfile);
router.post("/unsub", [express.json(), unsub]);
router.post("/subscribe", [express.json(), subscribe]);
router.post("/followUser", [express.json(), followUser])
router.post("/unfollowUser", [express.json(), unfollowUser])


function unfollowUser(req, res, next) {

    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);

        console.log(postData);


        fileName = path.join("jsonData/users/" + req.session.user);

        //add the subscribed name to the user
        fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.log("Something went wrong with reading the user when attempting to subscribe.");
            }

            else {
                console.log("arrived");

                //add the actor name to subscribed actors
                user = JSON.parse(data);
                let i = 0;
                user.subscribedUsers.forEach(element => {

                    if (element === postData[0]) {
                        console.log("Found subscribed user. Removing...");
                        user.subscribedUsers.splice(i, 1);
                        fs.writeFile(fileName, JSON.stringify(user), function (err) {
                            if (err) {
                                console.log("Error saving users after removing from subscribe.");
                                console.log(err);
                            } else {
                                console.log("Person saved.");
                            }
                        });

                    }
                    i++;
                });

                res.status(200);
                next();

            }
        });


    });
}
function followUser(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);



        fileName = path.join("jsonData/users/" + req.session.user);

        //add the subscribed name to the user
        fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.log("Something went wrong with reading the user when attempting to subscribe.");
            }

            else {
                //add the actor name to subscribed actors
                user = JSON.parse(data);
                user.subscribedUsers.push(postData[0]);
                fs.writeFile(fileName, JSON.stringify(user), function (err) {
                    if (err) {
                        console.log("Error saving users after adding to subscribe.");
                        console.log(err);
                    } else {
                        //console.log("Person saved.");
                    }
                });
                res.status(200);
                next();

            }
        });


    });

}

function unsub(req, res, next) { //does not work
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);



        fileName = path.join("jsonData/users/" + req.session.user);

        //add the subscribed name to the user
        fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.log("Something went wrong with reading the user when attempting to subscribe.");
            }

            else {
                //add the actor name to subscribed actors
                user = JSON.parse(data);
                let i = 0;
                user.subscribedActors.forEach(element => {

                    if (element === postData[0]) {
                        console.log("Found subscribed actor. Removing...");
                        user.subscribedActors.splice(i, 1);
                        fs.writeFile(fileName, JSON.stringify(user), function (err) {
                            if (err) {
                                console.log("Error saving users after removing from subscribe.");
                                console.log(err);
                            } else {
                                console.log("Person saved.");
                            }
                        });

                    }
                    i++;
                });

                res.status(200);
                next();

            }
        });


    });
}

function subscribe(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);



        fileName = path.join("jsonData/users/" + req.session.user);

        //add the subscribed name to the user
        fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                console.log("Something went wrong with reading the user when attempting to subscribe.");
            }

            else {
                //add the actor name to subscribed actors
                user = JSON.parse(data);
                user.subscribedActors.push(postData[0]);
                fs.writeFile(fileName, JSON.stringify(user), function (err) {
                    if (err) {
                        console.log("Error saving users after adding to subscribe.");
                        console.log(err);
                    } else {
                        //console.log("Person saved.");
                    }
                });
                res.status(200);
                next();

            }
        });


    });



}


function otherProfile(req, res, next) {
    res.format({
        "application/json": function () {
            let nameUser = req.params.name;
            let fileName = path.join("jsonData/users", nameUser);
            let data = fs.readFileSync(fileName);
            req.user = JSON.parse(data);
            req.user.password = [];

            if (req.user.userType === true) {
                req.user.userType = "Contributing";
            }
            else {
                req.user.userType = "Non Contributing";
            }
            res.status(200).json(req.user);

        },
        "text/html": function () {
            let nameUser = req.params.name;
            let fileName = path.join("jsonData/users", nameUser);
            if (fs.existsSync(fileName)) {
                //save the looked at person to data
                let data = fs.readFileSync(fileName);
                req.user = JSON.parse(data);

                //see if session user following this person
                let following;
                if (req.session.loggedIn) {

                    fileName = path.join("jsonData/users/" + req.session.user);
                    fs.readFile(fileName, { encoding: 'utf-8' }, function (err, data) {
                        if (err) {
                            console.log("Something went wrong with reading the user following.");
                            return false;
                        }
                        else {
                            use = JSON.parse(data);
                            following = false;
                            use.subscribedUsers.forEach(element => {
                                if (element === nameUser) {
                                    console.log("Found " + nameUser);
                                    following = true;
                                }
                            });
                        }
                        processFile(following);
                    });
                }
                else {
                    processFile(false);
                }
                function processFile(following) {
                    let uReviews = req.user.reviews;
                    res.render("pages/selfProfile", { uReviews, following, loggedIn: req.session.loggedIn, other: true, user: req.user, recommendations: req.user.likedMovies });
                    res.status(200);
                    next();
                }
            } else {
                res.status(404).send("Could not find profile for user " + req.params.name);
            }
        }


    });
}

function upgrade(req, res, next) {
    console.log("we here");
    req.session.contributor = !req.session.contributor;
    let fileName = path.join("jsonData/users", req.session.user);
    if (fs.existsSync(fileName)) {
        let data = fs.readFileSync(fileName);
        req.user = JSON.parse(data);

        req.user.userType = !req.user.userType;
        fs.writeFile(fileName, JSON.stringify(req.user), function (err) {
            if (err) {
                console.log("Error saving users.");
                console.log(err);
            } else {
                //console.log("Person saved.");
            }
        });
        res.status(200);
        next()
    } else {
        res.status(404).send("Could not find profile for user.");
    }
}
function signup(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);


        fileName = "jsonData/users/" + postData[0];


        if (fs.existsSync(fileName)) {
            console.log("This account exists");
            res.status(200);
            next();
        }

        else {
            postData[0] = {
                name: postData[0],
                password: postData[1],
                userType: false,
                likedMovies: [],
                subscribedActors: [],
                subscribedUsers: [],
                reviews: []
            }

            fs.writeFile(path.join("jsonData/users/" + postData[0].name), JSON.stringify(postData[0]), function (err) {
                if (err) {
                    console.log("Error saving users.");
                    console.log(err);
                } else {
                    alert("Welcome to the site" + postData[0].name);
                }
            });
        }
    });
}
function logout(req, res, next) {
    if (req.session.loggedIn) {
        req.session.loggedIn = false;
        req.session.user = null;
        req.session.contributor = false;
        res.status(200).send("Logged out.");
    } else {
        res.status(200).send("You cannot log out because you aren't logged in.");
    }
}


function login(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);
        //postdat[0] username
        //postdat[1] pass

        let readFolder = "jsonData/users/";
        let foundLog = false;
        fs.readdirSync(readFolder).forEach(file => {
            let data = fs.readFileSync(readFolder + file);
            let usrData = JSON.parse(data);

            if (usrData.name === postData[0] && usrData.password === postData[1]) {
                console.log("You are logged in " + usrData.name);
                req.session.user = file;
                req.session.loggedIn = true;
                req.session.contributor = usrData.userType;
                foundLog = true;
                
            }
        });

        if (foundLog) {
            res.status(200);
            next();
        } else {
            res.status(401);
            next();
        }

    });

};
module.exports = router;