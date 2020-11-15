///////////////////////// General Info ////////////////////////////////////////////
Name: Michael Shlega
Student Id: 101147839
Project Chosen: I am working on the movie database project all by my lonesome

Install Instructions: 
npm install
(I was scared of removing package-lock.json, I hope it doesn't impact things)

Run Instructions:
node serverGenerator.js   (running for the first time, or if you want to clean data with a fresh restart going back the original info)
node server.js




Buckle in for the read of a lifetime. I have put my blood, tears, and snot into this ReadMe and checkIn. I hope you enjoy navigating the program and it takes away from the 
monotony of marking. Enjoy and thanks in advance for your feedback! 


key visual notes:
----------------
You'll have to login using a user, or create one and then login with them. They start off being non contributors, so some buttons will not be visible like add movie, add actor, and edit movie. To see this, go to your profile, click on the change to contributor and voila, the whole site will open up to you. If you wish to go back you'll see the option for it. 

The index page has no images. This is intentional. I haven't decided how I want to "market" my front page, but I will be including pictures here in the next check in. 
The actor page too holds false values. Don't click on the example LOTR actors, it'll crash and you'll be like "dang this sucks". Don't do it please (unless you want to rerun the server)

///////////////////////// File Descriptions ////////////////////////////////////////////

- serverGenerator.js
This is a file generator script. It creates an original copy of the server using recursion and basically whenever run, resets the server. 
Please only run this whenever resetting or on the first run through, otherwise all your hard work (like entering new movies) will dissapear.
I fell for that trap ONCE.



- server.js
This is the main server file. It relegates routing first and foremost, implements sessions, does the searching, and serves up the various files required for js. 


Please note. User searching is not implemented. It is there, I just didn't get a chance to link it with express. In fact, using that button will yield an error (please dont click it, you'll get dissapointed)
Instead look at the search movie and search actor! Those work well :)

- js
This whole directory is essentially responsible for all of the post and put requests. It's the same pattern everywhere really. Gets the value in the form, and using fetch, sends it over through put/post


- jsonData
This directory is my amazing database. Yes, calling it a database is a stretch, but you never call your child a dissapointment so here we are. 
It holds all the information in RAM and contains reviews, ratings, users, movies. Things are added to here during the program run as you will see and edited. 

- routes
Holds all of the js routing files. You'll see the methodology of how I split it up, but I basically went with users,people,movies as the sub routers. They all contain sessions and use them.

- views
PUG files. The files have some logic in that they see if the user logged in to display thing, who is logged in, etc..
I'm quite proud of this too, they change based on if you're logged in and logged out.

- readMe...
3 read mes. I include the previous ones in case you want to see about the last checkin. 

///////////////////////// Extensions ////////////////////////////////////////////
- This is a mobile friendly site. And desktop friendly. All screens friendly really, it's coded using Bulma and the method utilises mobile first approach, thus my code will work on any size

- File system? Not sure if this is an extension, but it's basically a database ;)

- 

///////////////////////// Expecations covered ////////////////////////////////////////////

- There is express being used all over. PURE EXPRESS POWER

- User sessions are actively used, in fact, I would say they are fully supported. 

- RESTful Api
This one needs a bit of explaining because, it is finalized! It just has a couple different names and no return for JSON. This will be done for next checkin.
The logic is all there though, as is (excluding user search) it linked to the express. Just need to be like "you want JSON? Take it" as well as ensure the requests coming in are valid (both from the JSON side and the HTML user side, there are some places I do check, and some I haven't gotten around to yet)

- Express functionality connecting business logic
90% finished up! There are some things not fully connected (such as the user search). Nor is the follow actor/user connected, but the logic exists.

- Supporting almost all of the end functionality
I got dis! It's almost all here! Excluding the couple things mentioned above. 

///////////////////////// Design Decisions ////////////////////////////////////////////
--This is the logic decisions
    - unique ids being the name/title of the object. This makes things better in terms of everything actually. I can search for a file by a uniqueId, since these names cannot be 
    repeated. Keeps the system well organized and on track

    - If you are not logged in, you have no access other than viewing. This is important because I think that there should be no changes allowed by a non user

    - The splitting of things into router. This is a design decision that modulates the program further and allows for effective routing throughout delegating tasks that are meant for each router seperately. 

    - Keeping JS files responsible for their own thing. Keeps the program modulated and organized

    - Im gonna say my server generation is a good design decision, just because of how it has really helped in testing. being able to reset the server to a previous version has been a lifesaver when something goes wrong

    - In most situations I use readFile/writeFile rather than normal readFileSync. This is to allow multiple user load on the server that wont break it down. Some areas I used the sync file, but they are negligible in the overall connectivity time. My method of allowing node to run in the background is in the spirit of node too since this allows node to run in the background doing other things. This is a scalable approach! 

    - Paramerization. This allows my program to be more moldable various querries allowing for more fluid activites rather than deadset options. This too is a scalable approach!

    - Sessions are encryped using secrets. 

    - Standard error codes are used. When someone fails to authorize the server sends 401 for example. This is consistent and follows REST principles. 

-- This is the UX design decisions
    - Mobile first approach (mentioned above in extensions, however it is a design decision originally)

    - 3 click rule. You are able to get anywhere you would like in my site with 3 clicks. This is important in user retention as UX experts say that 3 clicks appears to be the optimal. (In fact some say that every step should take you coser to goal, while elimination as much of the non destination which is exactly the way my program has been organized)

    - No large clumps of text. UX shows users dont read, rather they scan. Having blocks showing the information and easiy distinguishing a certain object makes it more appealing to the user and easier to navigate. 

    - Feature exposure. The features of the site are easy to be noted, thus again, leading the site user through the content in simple and user friendly manner

    - Color palette. The colors match well and make it more appealing to look at. At least I liked it, but then again, I did make it

    - 

///////////////////////// Open stack ////////////////////////////////////////////
This was quite unfortunate, I was not added to 2406 instance.
I could not select this option on open stack, so alas I submit this in a zip file. 
I'll wake up to double check if something changes, but as of writing this open stack was not allowing me to access 2406. (that sounds like a diary entry right there)


Thanks for reading this ReadMe, I hope it was entertaining and also gives a good analysis of my program.
 