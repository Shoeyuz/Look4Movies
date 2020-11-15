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


router.get("/upgrade",upgrade);
router.get("/others/:name", otherProfile);

router.get("/selfProfile", (req, res, next) => {
	
	let fileName = path.join("jsonData/users",req.session.user);
    if(fs.existsSync(fileName)){
        let data = fs.readFileSync(fileName);
        req.user = JSON.parse(data);
        
        res.render("pages/selfProfile", {loggedIn: req.session.loggedIn, other: false, user: req.user, recommendations: req.user.likedMovies });
        //next()
        
        res.status(200);
    } else {
        res.status(404).send("Could not find profile for user.");
    }
    
});

function otherProfile(req,res,next){
    let nameUser = req.params.name;

    let fileName = path.join("jsonData/users",nameUser);
    if(fs.existsSync(fileName)){
        let data = fs.readFileSync(fileName);
        req.user = JSON.parse(data);
        
        res.render("pages/selfProfile", {loggedIn: req.session.loggedIn, other: true, user: req.user, recommendations: req.user.likedMovies });
        //next()
        res.status(200);

    } else {
        res.status(404).send("Could not find profile for user.");
    }
}

function upgrade(req,res,next){
    console.log("we here");
    req.session.contributor = !req.session.contributor;
    let fileName = path.join("jsonData/users",req.session.user);
    if(fs.existsSync(fileName)){
        let data = fs.readFileSync(fileName);
        req.user = JSON.parse(data);

        req.user.userType = !req.user.userType;
        fs.writeFile(fileName, JSON.stringify(req.user), function(err){
            if(err){
                console.log("Error saving users.");
                console.log(err);
            }else{
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
       

        fileName = "jsonData/users/"+postData[0];

        
        if (fs.existsSync(fileName)) {
            console.log("This account exists");
            res.status(200);
            next();
        }

        else{
            postData[0] = {
                name: postData[0],
                password: postData[1],
                userType: false,
                likedMovies: [],
                subscribedActors: [],
                subscribedUsers: []
            }

            fs.writeFile(path.join("jsonData/users/" + postData[0].name), JSON.stringify(postData[0]), function(err){
                if(err){
                    console.log("Error saving users.");
                    console.log(err);
                }else{
                    //console.log("Person saved.");
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
    next();
}


function login(req, res, next) {
    let postData = "";
    req.on("data", chunk => postData += chunk);

    req.on("end", () => {
        postData = JSON.parse(postData);
        //postdat[0] username
        //postdat[1] pass

        let readFolder = "jsonData/users/";

        fs.readdirSync(readFolder).forEach(file => {
            console.log(postData);
            console.log(file);
            let data = fs.readFileSync(readFolder + file);
            let usrData = JSON.parse(data);

            if (usrData.name === postData[0] && usrData.password === postData[1]) {
                console.log("You are logged in! ");
                req.session.user = file;
                req.session.loggedIn = true;
                req.session.contributor = usrData.userType;

                res.status(200);
                next();
            }
        });

        res.status(401);
        console.log("Unauthorized name");
        next();
    });

};
module.exports = router;