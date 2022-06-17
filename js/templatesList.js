addTemplateButton = document.querySelector(".add-template");
createWorkoutDialog = document.querySelector(".create-template");
createWorkoutDialog.addEventListener('cancel',event => {
    //alert("DON'T MINIMIZE ME GREY!");
    //alert("YOU MUSTN'T MINIMIZE ME");
    //event.preventDefault();
});

addTemplateButton.addEventListener('click',openWorkoutPanel);

function openWorkoutPanel(event){
    //Create page loading if data-id for this template shows something aka for edition
    createWorkoutDialog.showModal();
}