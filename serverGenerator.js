
let movieData = require("./movies.json");
const fs = require("fs");
const fsExtra = require('fs-extra');
const path = require("path");


//takes in movie data and creates an actor dictionary from it
/*
name : {
	movies: [array of movies the actor has acted in],
	actedWith: {
		actorName: occurenceAmount;	
	}
}
*/

//REMOVING OLD DATA FROM ALL JSON DATA FOLDERS
fsExtra.emptyDirSync("jsonData/movies");
fsExtra.emptyDirSync("jsonData/people");
fsExtra.emptyDirSync("jsonData/reviews");
fsExtra.emptyDirSync("jsonData/users");
fsExtra.emptyDirSync("jsonData/ratings");



//CREATING NEW DATA
let users = {};

let movieRatings = {};
createDictForRatings(); //creates dictionary for ratings

let actors = {};
cleanWriters();
createActorList();

let movieReviews = {};
createDictForReviews(); //creates dictionary for the reviews

generateUsers();

//adds data to file storage within the server
createMovieData();
createActorData();
createUserData();
createRatingData();
createRevieData();
//creating json of movies
function createMovieData(){
    for(movie in movieData){
		fs.writeFile(path.join("jsonData/movies/" + movieData[movie].Title), JSON.stringify(movieData[movie]), function(err){
			if(err){
				console.log("Error saving products.");
				console.log(err);
			}else{
				//console.log("Movies saved.");
			}
		});
	}
}

function createActorData(){
	for(actor in actors){
		fs.writeFile(path.join("jsonData/people/" + actors[actor].name), JSON.stringify(actors[actor]), function(err){
			if(err){
				console.log("Error saving people.");
				console.log(err);
			}else{
				//console.log("Person saved.");
			}
		});
	}
}

function createUserData(){
	for(user in users){
		fs.writeFile(path.join("jsonData/users/" + user), JSON.stringify(users[user]), function(err){
			if(err){
				console.log("Error saving users.");
				console.log(err);
			}else{
				//console.log("Person saved.");
			}
		});
	}
}

function createRatingData(){
	for(movie in movieRatings){
		fs.writeFile(path.join("jsonData/ratings/" + movie), JSON.stringify(movieRatings[movie]), function(err){
			if(err){
				console.log("Error saving ratings.");
				console.log(err);
			}else{
				//console.log("Person saved.");
			}
		});
	}
}

function createRevieData(){
	for(movie in movieReviews){
		fs.writeFile(path.join("jsonData/reviews/" + movie), JSON.stringify(movieReviews[movie]), function(err){
			if(err){
				console.log("Error saving ratings.");
				console.log(err);
			}else{
				//console.log("Person saved.");
			}
		});
	}
}




/////////////////////////////////////////////////////// DATA INITIALIZATION AND CLEANUP /////////////////////////////////////////////////////////////

function generateUsers(){
	users = {

		"Cronk": {
			name: "Cronk",
			password: "12345",
			userType: false,
			likedMovies: ["Heat", "Jumanji"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew", "Michael"],
			notifications: [],
			reviews: []

		},
	
		"Michael": {
			name: "Michael",
			password: "2",
			userType: true,
			likedMovies: ["Heat", "Jumanji"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew", "Cronk"],
			notifications: [],

			reviews: []

		},
	
		"Mathew": {
			name: "Mathew",
			password: "54321",
			userType: false,
			likedMovies: ["Heat", "Jumanji"],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Michael", "Cronk"],
			notifications: [],

			reviews: []
	
		}
	
	
	};
	//the key is their id
}

//creates json of the people (actors/directors/writers)
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
		let temp = movieData[i].Director.split(", ");
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

				*/
		}
	}
}

function createDictForRatings() {

	for (let i = 0; i < movieData.length; i++) {
		if (!(movieData[i].Title in movieRatings)) {
			movieRatings[movieData[i].Title] = [];
		}
		//all movies start with a weighting of 5.5
	}
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


