



document.addEventListener('DOMContentLoaded', () => {


  //close the modal pop ups so they dont show
  closeRate();
  closeReview();



});


// Responsible for modal actions

//adding action listeners to modal 
document.getElementById("rateMovie").addEventListener('click', openRate);
document.getElementById("reviewMovie").addEventListener('click', openReview);


//adding action listeners to modal sections
document.getElementById("closeRate").addEventListener('click', closeRate);
document.getElementById("closeReview").addEventListener('click', closeReview);

document.getElementById("cancelRate").addEventListener('click', closeRate);
document.getElementById("cancelReview").addEventListener('click', closeReview);



//open sign up modal
function openReview() {

  document.getElementById("review").classList.add("is-active");
}

//close sign up modal
function closeReview() {
  document.getElementById("review").classList.remove("is-active");

  //clears the input in the form
  document.getElementById("reviewForm").reset();

}


//open log in modal
function openRate() {
  document.getElementById("rate").classList.add("is-active");
}

//close sign up modal
function closeRate() {
  document.getElementById("rate").classList.remove("is-active");

  //clears the input in the form
  document.getElementById("rateForm").reset();

}



document.getElementById("submitRate").addEventListener('click', addRating);

function addRating() {
  let title = document.title;
  const rating = document.getElementById("ratingValue").value;


  const sending = [];
  sending.push(title);
  sending.push(rating);

  //console.log(sending);
  if (!(rating > 0 && rating <= 10)) {
    alert("Please enter a value that is 0-10");
  }

  else {
    fetch("/submitRate", {
      method: "post",
      body: JSON.stringify(sending)
    }).then(() => {
      location.reload();
    }).catch(err => {
      alert(err);
    })


    closeRate();

  }
}



document.getElementById("submitReview").addEventListener('click', addReview);

function addReview() {
  let title = document.title;

  const rating = document.getElementById("rval").value;
  const plotSum = document.getElementById("plotSummary").value;
  const review = document.getElementById("theReview").value;

  const sending = [];


  const id = "1001";


  sending.push(title);
  sending.push(rating);
  sending.push(plotSum);
  sending.push(review);
  sending.push(id);




  //console.log(sending);
  if (!(rating > 0 && rating <= 10)) {
    alert("Please enter a value that is 0-10");
  }

  else {
    fetch("/submitReview", {
      method: "post",
      body: JSON.stringify(sending)
    }).then(() => {
      location.reload();
    }).catch(err => {
      alert(err);
    })


    closeReview();

  }
}


