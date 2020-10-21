



document.addEventListener('DOMContentLoaded', () => {


    //close the modal pop ups so they dont show
    closeRate();
    closeReview();


  
});


// Responsible for modal actions

//adding action listeners to modal 
document.getElementById("rateMovie").addEventListener('click',openRate);
document.getElementById("reviewMovie").addEventListener('click',openReview);


//adding action listeners to modal sections
document.getElementById("closeRate").addEventListener('click',closeRate);
document.getElementById("closeReview").addEventListener('click',closeReview);

document.getElementById("cancelRate").addEventListener('click',closeRate);
document.getElementById("cancelReview").addEventListener('click',closeReview);



//open sign up modal
function openReview(){
  
  document.getElementById("review").classList.add("is-active");
}

//close sign up modal
function closeReview(){
  document.getElementById("review").classList.remove("is-active");

  //clears the input in the form
  document.getElementById("reviewForm").reset();
 
}


//open log in modal
function openRate(){
  document.getElementById("rate").classList.add("is-active");
}

//close sign up modal
function closeRate(){
  document.getElementById("rate").classList.remove("is-active");

  //clears the input in the form
  document.getElementById("rateForm").reset();
 
}



