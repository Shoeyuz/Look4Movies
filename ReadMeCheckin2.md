# Look4Movies


Name: Michael Shlega
Student Id: 101147839
Project Chosen: I am working on the movie database project all by my lonesome
Install Instructions: 
npm install pug
Run Instructions:
node server.js
(I think you have node installed)

Okay so this readme is gonna be a wild ride. Buckle in, for I will be taking you through the bits and peices of my program. The server js file is about 800 lines,
so I will talk about the backend logic of some functions here to make it easier to reference. Also, is there a way to split up my server code? Going through 800 lines feels like an essay.

Before we start I will mention the extra expectations I touched on. Static pages are rendered using a template engine. It supports multiple resources too.
There are two POST requests to the server from reviewRate. These dynamically alter the page as well. 
For the business logic, I think its basically everything. I outline the files below to make it easier for you.

Files:
images:
    nothing in here for now. will be added into later on. 

Views:

    
    Pages: A lot of pug templates all linked to the server through get requests. They all have interlinking unless you see something which is related to Lord of the rings. These are my placeholders if you will.

        **There is no other user page. I included in last check in, however, I will be working with users and including the viewing capabilities later on with sessions

        actors: This page is a showing for actors. This is the same front end as the previous check in so I have not changed it up much. The search button does not work, however, the logic is coded and used in the search tab. Will be implementing later on to make it work here too. If you click these buttons they wont do anything and navigate to an unknown location for the server. Please don't it'll make you doubt my server. 

        actorSingle: A template of an actor object. The actor has their name, the movies they are in (currently using a default js file with small sample [can use 
        some of the logic to add actors to movies thereby increasing their movies in]) This also has frequent collaborators. THIS IS FOR ALL PEOPLE. DIRECTORS WRITERS OR ACTORS. Also a button which allows you to follow the respective person, but that will be funcitonal with sessions later so I can track the user following it - for now provides alert.

        index: The landing portion of my website. Basic front end, no js. 

        movies: this shows 3 of the most popular movies (using the popular function from my server) which goes through the movieData and selects movies with ratings
        higher than a given value. Currently there are only a few, but in large cases, I plan to raise the rating bar to filter out more. Will also look into tracking clicks on it? But not sure if this will work out 

        movieSingle: Same as actor single but for a movie. You'll see the movie info, and the actors/writers/directors
        This page has three buttons. Rate/Review/Edit movie. More info in rateReview.js, but in essence they add to the local ratings (not imdb, I wanted to keep them seperate) and the review one creates a review and adds it to the respective movie. Edit will edit movie allowing adding actors/writers. This code is written in the server, but not worked into the requests yet(logic there and tested, the actual POST not there) (POST used with rate and review though)


        search<somethingsResults>:
        Three templates based on the search type. Shows movie info, actors, users, with links to them.

        selfProfile: Your profile. Shows people you follow and users you follow. Allows buttons for managing settings and upgrading profile. These will be functional with the addition of sessions - for now provides alert. Shows movies recommended. Generates recommended movies using JS code based on liked movies by the user

    Partials: The lego blocks of my program
        modals: This is for the sign up and login. Every single page has it. Try them out! Submitting wont do anything but cancelling will clear the form and exit out the modal.

        nav: This is the navigation that you will see in every page. Every.Single.One. 

        reviewRate: This is a partial file for the movie which creates modal for rating and reviewing. These work in coherence with the js file reviewRate.js



All done with my pug stuff! Onto my js :)

    js 
    **NOTE: This is all gotten from the server through get requests and a couple of files make POST ajax requests**

        navigation.js: This is reponsible for the work that navigation does. Specifically opening the login/registration form and closing it
        
        reviewRate.js: This is my baby. It sends POST requests to the server based on what the input from the user is. Try to add a rating and see how the user rating value changes right away. Add a review and it too will be added to the list right away. After that request goes through it is saved in the reviews/ratings which is why you can see it.
        **NOTE: I do not have default reviews. So nothing will show right off the bat, you'll have to manually add it to see it get added and display. Hopefully thats ok**
        So the reviews and rates have a bit of error checking to make sure the value you enter into the rating is between 0-10. The user is also default to Michael as the name. This will change once I know about sessions

        searchMovie.js: This is my second baby. Searching happens through here. I take the form inputs for the search using various values as you will be able to see. Runtime does not work for now (there have been very weird bugs with it, so for now since its not a must, I will keep it out, but the function does support it. Just weird bugs sometimes like not showing runtimes below 100??? You may ask why? I do not know, but I will add it in for next check in)
        Search movie js is reponsible for the searchMovie.pug section of the html. However, it will be added later to work with movies and actors. 
        Anyway, you get to search for movies/people/users. Comes out in a list with some info about it and links (the user ones wont work as discussed before)
        THe querries string is made using your form. You can see in the URL what it looks like. I break it up in the GET request of the server and then from there look for the matching possibilities of movies.

        selfProfile.js: Just a couple buttons with alerts that allow you to get alerted when clicking on them. Will update to make them do something when I can get the user id of who clicked.

        singleActor.js: This only has subscribe to person. Same as above will update.


Thats it for js! Onto the server code 


    server.js ***this one is long so i will cover the main topics**

        Get and Post operations: Work as you would expect. 

        Functions: Some of these functions are used in the program already with POST/GET, while others are there for now just as logic. 

            function similarMovies: gets similar movies based on genre and Rated. (pg sticks with pg, not R)
            function recommendedMovie: gets recommended movies based on rating and genre
            function addActor: adds actor to the dictionary of actors (IF IT DONT EXIST. None of this shoving a double in)
            function addMovie: adds a movie to movieData (using a bunch of values provided. checks if the provided actors/writers/directors exist before adding)
            function editMovie: edits the given movie adding actors/writers to that movie
            function getMostPopular: gets the most popular movies above a certain rating
            find average: this gets the average of ratings to display for user ratings
            functions searchFor<user/actor/movie> Search for those objects given a param and return a list of matching objects

            All of the functions are at the bottom of the server code by the way. The ones above this line are the main business ones. Everything else you will find in the list is important to the way my program functions in creating types of objects/making searches/etc.. 

            function cleanWriters: this one was vital to clean up the json file getting it into the data format that I wanted
            It cleans a bit more than writers actually, but it started with writers at first. 

            function createActorList: creates actor dictionary of objects. 
                "actors name" = {movies: <moviesIN>, collaborators:<peopleTheyWorkWithALot>}

            function createDictOfReviews: creates review objects associated with the title of the movie and therefore the movie itself later

            function createDictForRatings: same as above but for ratings!

            function send404/send405: helper functions to send errors



Voila! This is my project. Sessions will make a big impact on how I will be working with some user data, which will I feel propel me right into an actual site. I'm quite excited for that.
Users are stored with IDs as a key and the object as a value in dictionary. 


