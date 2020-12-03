
 document.getElementById("subUser").addEventListener('click', subscribeToPerson);


 function subscribeToPerson() {
     const sending = [];
     sending.push(document.title);
     fetch("/users/followUser", {
         method: "post",
         body: JSON.stringify(sending)
     }).then(() => {
         location.reload();
     }).catch(err => {
         alert(err);
     });
 }
 
 