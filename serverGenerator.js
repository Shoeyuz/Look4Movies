
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
			likedMovies: [{
				"Title": "Jumanji",
				"Year": "1995",
				"Rated": "PG",
				"Released": "15 Dec 1995",
				"Runtime": "104 min",
				"Genre": "Adventure, Comedy, Family, Fantasy",
				"Director": "Joe Johnston",
				"Writer": "Jonathan Hensleigh (screenplay by), Greg Taylor (screenplay by), Jim Strain (screenplay by), Greg Taylor (screen story by), Jim Strain (screen story by), Chris Van Allsburg (screen story by), Chris Van Allsburg (based on the book by)",
				"Actors": "Robin Williams, Jonathan Hyde, Kirsten Dunst, Bradley Pierce",
				"Plot": "When two kids find and play a magical board game, they release a man trapped in it for decades - and a host of dangers that can only be stopped by finishing the game.",
				"Language": "English, French",
				"Country": "USA",
				"Awards": "4 wins & 11 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BZTk2ZmUwYmEtNTcwZS00YmMyLWFkYjMtNTRmZDA3YWExMjc2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "7.0/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "54%"
					},
					{
						"Source": "Metacritic",
						"Value": "39/100"
					}
				],
				"Metascore": "39",
				"imdbRating": "7.0",
				"imdbVotes": "297,463",
				"imdbID": "tt0113497",
				"Type": "movie",
				"DVD": "25 Jan 2000",
				"BoxOffice": "N/A",
				"Production": "Sony Pictures Home Entertainment",
				"Website": "N/A",
				"Response": "True"
			},
			{
				"Title": "Grumpier Old Men",
				"Year": "1995",
				"Rated": "PG-13",
				"Released": "22 Dec 1995",
				"Runtime": "101 min",
				"Genre": "Comedy, Romance",
				"Director": "Howard Deutch",
				"Writer": "Mark Steven Johnson (characters), Mark Steven Johnson",
				"Actors": "Walter Matthau, Jack Lemmon, Sophia Loren, Ann-Margret",
				"Plot": "John and Max resolve to save their beloved bait shop from turning into an Italian restaurant, just as its new female owner catches Max's attention.",
				"Language": "English, Italian, German",
				"Country": "USA",
				"Awards": "2 wins & 2 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BMjQxM2YyNjMtZjUxYy00OGYyLTg0MmQtNGE2YzNjYmUyZTY1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "6.7/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "17%"
					},
					{
						"Source": "Metacritic",
						"Value": "46/100"
					}
				],
				"Metascore": "46",
				"imdbRating": "6.7",
				"imdbVotes": "23,736",
				"imdbID": "tt0113228",
				"Type": "movie",
				"DVD": "18 Nov 1997",
				"BoxOffice": "N/A",
				"Production": "Warner Home Video",
				"Website": "N/A",
				"Response": "True"
			}],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew"],
		},
	
		"Michael": {
			name: "Michael",
			password: "2",
			userType: true,
			likedMovies: [{
				"Title": "Jumanji",
				"Year": "1995",
				"Rated": "PG",
				"Released": "15 Dec 1995",
				"Runtime": "104 min",
				"Genre": "Adventure, Comedy, Family, Fantasy",
				"Director": "Joe Johnston",
				"Writer": "Jonathan Hensleigh (screenplay by), Greg Taylor (screenplay by), Jim Strain (screenplay by), Greg Taylor (screen story by), Jim Strain (screen story by), Chris Van Allsburg (screen story by), Chris Van Allsburg (based on the book by)",
				"Actors": "Robin Williams, Jonathan Hyde, Kirsten Dunst, Bradley Pierce",
				"Plot": "When two kids find and play a magical board game, they release a man trapped in it for decades - and a host of dangers that can only be stopped by finishing the game.",
				"Language": "English, French",
				"Country": "USA",
				"Awards": "4 wins & 11 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BZTk2ZmUwYmEtNTcwZS00YmMyLWFkYjMtNTRmZDA3YWExMjc2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "7.0/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "54%"
					},
					{
						"Source": "Metacritic",
						"Value": "39/100"
					}
				],
				"Metascore": "39",
				"imdbRating": "7.0",
				"imdbVotes": "297,463",
				"imdbID": "tt0113497",
				"Type": "movie",
				"DVD": "25 Jan 2000",
				"BoxOffice": "N/A",
				"Production": "Sony Pictures Home Entertainment",
				"Website": "N/A",
				"Response": "True"
			},
			{
				"Title": "Grumpier Old Men",
				"Year": "1995",
				"Rated": "PG-13",
				"Released": "22 Dec 1995",
				"Runtime": "101 min",
				"Genre": "Comedy, Romance",
				"Director": "Howard Deutch",
				"Writer": "Mark Steven Johnson (characters), Mark Steven Johnson",
				"Actors": "Walter Matthau, Jack Lemmon, Sophia Loren, Ann-Margret",
				"Plot": "John and Max resolve to save their beloved bait shop from turning into an Italian restaurant, just as its new female owner catches Max's attention.",
				"Language": "English, Italian, German",
				"Country": "USA",
				"Awards": "2 wins & 2 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BMjQxM2YyNjMtZjUxYy00OGYyLTg0MmQtNGE2YzNjYmUyZTY1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "6.7/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "17%"
					},
					{
						"Source": "Metacritic",
						"Value": "46/100"
					}
				],
				"Metascore": "46",
				"imdbRating": "6.7",
				"imdbVotes": "23,736",
				"imdbID": "tt0113228",
				"Type": "movie",
				"DVD": "18 Nov 1997",
				"BoxOffice": "N/A",
				"Production": "Warner Home Video",
				"Website": "N/A",
				"Response": "True"
			}],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Mathew"],
		},
	
		"Mathew": {
			name: "Mathew",
			password: "54321",
			userType: false,
			likedMovies: [{
				"Title": "Jumanji",
				"Year": "1995",
				"Rated": "PG",
				"Released": "15 Dec 1995",
				"Runtime": "104 min",
				"Genre": "Adventure, Comedy, Family, Fantasy",
				"Director": "Joe Johnston",
				"Writer": "Jonathan Hensleigh (screenplay by), Greg Taylor (screenplay by), Jim Strain (screenplay by), Greg Taylor (screen story by), Jim Strain (screen story by), Chris Van Allsburg (screen story by), Chris Van Allsburg (based on the book by)",
				"Actors": "Robin Williams, Jonathan Hyde, Kirsten Dunst, Bradley Pierce",
				"Plot": "When two kids find and play a magical board game, they release a man trapped in it for decades - and a host of dangers that can only be stopped by finishing the game.",
				"Language": "English, French",
				"Country": "USA",
				"Awards": "4 wins & 11 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BZTk2ZmUwYmEtNTcwZS00YmMyLWFkYjMtNTRmZDA3YWExMjc2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "7.0/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "54%"
					},
					{
						"Source": "Metacritic",
						"Value": "39/100"
					}
				],
				"Metascore": "39",
				"imdbRating": "7.0",
				"imdbVotes": "297,463",
				"imdbID": "tt0113497",
				"Type": "movie",
				"DVD": "25 Jan 2000",
				"BoxOffice": "N/A",
				"Production": "Sony Pictures Home Entertainment",
				"Website": "N/A",
				"Response": "True"
			},
			{
				"Title": "Grumpier Old Men",
				"Year": "1995",
				"Rated": "PG-13",
				"Released": "22 Dec 1995",
				"Runtime": "101 min",
				"Genre": "Comedy, Romance",
				"Director": "Howard Deutch",
				"Writer": "Mark Steven Johnson (characters), Mark Steven Johnson",
				"Actors": "Walter Matthau, Jack Lemmon, Sophia Loren, Ann-Margret",
				"Plot": "John and Max resolve to save their beloved bait shop from turning into an Italian restaurant, just as its new female owner catches Max's attention.",
				"Language": "English, Italian, German",
				"Country": "USA",
				"Awards": "2 wins & 2 nominations.",
				"Poster": "https://m.media-amazon.com/images/M/MV5BMjQxM2YyNjMtZjUxYy00OGYyLTg0MmQtNGE2YzNjYmUyZTY1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
				"Ratings": [
					{
						"Source": "Internet Movie Database",
						"Value": "6.7/10"
					},
					{
						"Source": "Rotten Tomatoes",
						"Value": "17%"
					},
					{
						"Source": "Metacritic",
						"Value": "46/100"
					}
				],
				"Metascore": "46",
				"imdbRating": "6.7",
				"imdbVotes": "23,736",
				"imdbID": "tt0113228",
				"Type": "movie",
				"DVD": "18 Nov 1997",
				"BoxOffice": "N/A",
				"Production": "Warner Home Video",
				"Website": "N/A",
				"Response": "True"
			}],
			subscribedActors: ["Sean Bean"],
			subscribedUsers: ["Michael"],
	
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
		let temp = movieData[i].Director;
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
			movieRatings[movieData[i].Title] = [5, 6];
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


