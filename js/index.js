document.addEventListener('DOMContentLoaded', () => {


    //close the modal pop ups so they dont show
    closeSignUp();


    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {
  
      // Add a click event on each of them
      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          // Get the target from the "data-target" attribute
          const target = el.dataset.target;
          const $target = document.getElementById(target);
  
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  
  });


// Responsible for modal actions

//adding action listeners to modal 
document.getElementById("signUp").addEventListener('click',openSignUp);


//adding action listeners to modal sections
document.getElementById("closeSignUp").addEventListener('click',closeSignUp);
document.getElementById("cancelSignUp").addEventListener('click',closeSignUp);




//open sign up modal
function openSignUp(){
  
  document.getElementById("signUpModal").classList.add("is-active");
}

//close sign up modal
function closeSignUp(){
  document.getElementById("signUpModal").classList.remove("is-active");

}

