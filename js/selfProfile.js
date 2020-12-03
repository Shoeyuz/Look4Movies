
document.addEventListener("DOMContentLoaded", function(event) {
  // Your code to run since DOM is loaded and ready

document.getElementById("change").addEventListener('click',upgradeProfile);


function upgradeProfile(){
    fetch("/users/upgrade", {
        method: "get",
      }).then(() => {
        location.reload();
      }).catch(err => {
        alert(err);
      });
  
 }


//post request here with id once sessions figured out changing the js object for that specific user in the server


});

