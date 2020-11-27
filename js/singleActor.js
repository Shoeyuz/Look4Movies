

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
document.getElementById("unsubActor").addEventListener('click', unsub);

function unsub() {
    console.log("unsubing........");
    const sending = [];
    sending.push(document.title);

    fetch("/users/unsub", {
        method: "post",
        body: JSON.stringify(sending)
    }).then(() => {
        location.reload();
    }).catch(err => {
        alert(err);
    });

}


