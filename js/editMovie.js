closeEdit();
document.getElementById("editMovie").addEventListener('click', openEdit);
document.getElementById("closeEdit").addEventListener('click', closeEdit);
document.getElementById("cancelEdit").addEventListener('click', closeEdit);
function openEdit() {
    document.getElementById("addPeople").classList.add("is-active");

}

function closeEdit() {
    document.getElementById("addPeople").classList.remove("is-active");
    document.getElementById("editForm").reset();
}


document.getElementById("submitEdit").addEventListener('click', addEdit);

function addEdit() {
    const sending = [];

    let title = document.title;

    const actors = document.getElementById("a").value;
    const writers = document.getElementById("w").value;


    sending.push(actors);
    sending.push(writers);
    console.log(sending);
    fetch("/movies/" + title + "/edit", {
        method: "put",
        body: JSON.stringify(sending)
    }).then(() => {
        location.reload();
    }).catch(err => {
        alert(err);
    })


    closeEdit();
}