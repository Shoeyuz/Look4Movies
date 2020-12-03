document.addEventListener('DOMContentLoaded', () => {
  // Responsible for modal actions
  
  document.getElementById("addNewActor").addEventListener('click', openNewActor);
  document.getElementById("closeNewActor").addEventListener('click', closeNewActor);
  document.getElementById("cancelNewActor").addEventListener('click', closeNewActor);
  document.getElementById("submitNewActor").addEventListener('click', addActor);

  function openNewActor() {
    document.getElementById("newActorModal").classList.add("is-active");
  }
  function closeNewActor() {
    document.getElementById("newActorModal").classList.remove("is-active");

    //clears the input in the form
    document.getElementById("newActorForm").reset();
  }

  function addActor() {
    const name = document.getElementById("actorName").value;


    const sending = [];
    sending.push(name);

    fetch("/people/submit", {
      method: "post",
      body: JSON.stringify(sending)
    }).then(() => {
    }).catch(err => {
      alert(err);
    })


    closeNewActor();
  }

});
