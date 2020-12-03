
document.addEventListener('DOMContentLoaded', function() {
        
    document.getElementById("subscribeToActor").addEventListener('click', subscribeToPerson);


    function subscribeToPerson() {
        const sending = [];
        sending.push(document.title);
        fetch("/users/subscribe", {
            method: "post",
            body: JSON.stringify(sending)
        }).then(() => {
            location.reload();
        }).catch(err => {
            alert(err);
        });
    }
 });



