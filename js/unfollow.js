document.getElementById("unsubUser").addEventListener('click', unsub);

 function unsub() {
     const sending = [];
     sending.push(document.title);
 
     fetch("/users/unfollowUser", {
         method: "post",
         body: JSON.stringify(sending)
     }).then(() => {
         location.reload();
     }).catch(err => {
         alert(err);
     });
 
}