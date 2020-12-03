


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("lgOut").addEventListener('click',startLogout);

function startLogout(){
  fetch("/users/logout", {
    method: "get"
  }).then(() => {
    location.reload();
  }).catch(err => {
    alert(err);
  });


}
});