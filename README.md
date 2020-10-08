# Look4Movies


Name: Michael Shlega
Student Id: 101147839
Project Chosen: I am working on the movie database project
Install Instructions: Should run fine using browser. Fire up index.html as a starting point

FILES SUBMITTED:
    images
        This is an empty directory for now. Will store images for the various aspects later on. (user images, actor images, movie pictures, etc..)

    css:
        index.css 
            This file is just used temporary. It is in fact, empty. The purpose of it is to be a skeleteon to which I will add later on. Most of the CSS is through bulma so CSS will not be being used as often.

    html
        actors.html
            The main page for looking for actors. Will be used to showcase random actors (9 of them) using a picture as well as their name above it. Clickable(on images) and leads to the actors page.
            There is a search function which allows people to search for an actor/writer/director. This will lead to a page called moviesPossible.html where there will be a list. The plan is to make a template of the page based on what the search is. (might make another page later depending on how templates work to seperate actor and movies)
        
        actorSingle.html
            This page is dedicated to one single actor. Will be populated using a template engine. There is name, bio, movies acted in (all clickable), moives directed (clickable again) and frqequent collaborators (clickable).


        genres.html
            A page that will show the available genres to look at as well as a search function. Both will lead to moviesPossible.html

        index.html (called dashboard on nav)
            Landing page of the site. Shows 4 of the main options within the site. 


        movies.html
            Shows a list of movies similar to the actors page. Same functionality too

        movieSingle.html
            Again, similar to actorSingle. Shows the name,info, pic, cast, similar movies, reviews and option to add reviews (rate and review options)

        moviesPossible.html
            big list of movies. (will hold actors later on using template engine) Shows info 

        searchMovies.html
            Search area which allows specification of anything

        selfProfile.html
            how the user views themselves

        userSingle.html
            How user views other profiles. Log in pops up to ensure user logs in before viewing. Will make permanent later

        
    js
        actor.js
        actorSingle.js
        genres.js
        index.js
        movies.js
        movieSingle.js
        moviesPossible.js
        searchMovies.js
        selfProfile.js
        userSingle.js

        These are all basicly similar right now. There is a responsive navbar for all which has a burger menu if the window gets small enough. They all have a login and sign up modal which clear on exit. The ones with a search function on the screen have a button with onclick capablities in a form and lead to a new window of search



Additional Functionality:
    1. There is linkage between all pages
    2. The responsive nav bar (all pages) (js used to activate burger and deactivate)

    3. The log in and sign up modals (all pages work). Open on click and clear upon close (this was actually harder than I thought to do). Use forms for submission purposes

    4. The search buttons which use forms for submission purposes and open a new window with the resulting search


    5. This is a mobile first built site. Pages are responsive to any sizing and will work well with any type of device used to access them. 


Extra Info: (plans for future if you will)

    The javascript object for my movies will look something like this

    movie{
        title:  ,
        picture: ,
        runtime: ,
        releaseYear: ,
        genres []:  ,
        rating []: , <- this will be an average of the whole list so that new reviews added change it
        actors []:  ,
        reviews [] , <-holds reviews given>

    }

    The function findSimilarMovies(){
        pseudocode:

        look for similar genres
        look for overlapping actors
        if contains genre and contains actor, return

    }



    The actor object:

    actor{
        name:   ,
        image: ,
        bio: ,
        moviesActedIn []: ,
        followers []: ,
    }

    function findFrequentCollaborators(){
        pseudocode:

        look for common movies together
        stick in array
        return array
    }


    The user object:

    user{
        loggedIn: boolean,
        reviews []:,
        personsFollowing []: ,
        usersFollowing []: ,
        followers []:  ,

    }




        
