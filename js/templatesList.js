let addTemplateButton = document.querySelector(".create-new-template-button");
let createTemplateDialog = document.querySelector(".create-template-dialog");
let addTemplateField = document.querySelector(".add-field-button");
let addNewField = document.querySelector(".add-new-field");
let fieldsContainer = document.querySelector(".fields-list");

addTemplateButton.addEventListener('click',openTemplateCreation);
createTemplateDialog.addEventListener('cancel',onTemplateCreationCancel);
addTemplateField.addEventListener('click',tryCreatingTemplateField);

class WorkoutTemplate{
    constructor(name,place){
        this.name = name;
        this.place = place;
        this.fields = [];
    }

    addField(name, type){
        this.fields.push(new WorkoutField(name,type));
    }

    generateWorkoutTemplate(){

    }
}

class WorkoutField{
    constructor(name,type){
        this.name = name;
        this.type = type;
    }

    generateWorkoutField(){
        let newField = document.createElement('div');
        newField.classList.add("template-field");

        let span = document.createElement('span');
        span.classList.add('field-name');
        span.textContent = this.name; //Zabezpieczenie przed HTML injection

        newField.appendChild(span);

        let result = "";
        if(this.type.includes("sets-and-reps")){
            newField.appendChild(generateNumberPart('sets',this.name));
            newField.appendChild(generateNumberPart('reps',this.name));
            if(this.type === "sets-and-reps-with-weight"){
                newField.appendChild(generateNumberPart('weight',this.name));
            }
        }
        
        if(this.type === 'checkbox'){

        }

        newField.innerHTML += result;

        fieldsContainer.insertBefore(newField,addNewField);
    }
}

function generateNumberPart(category,name){
    let label = document.createElement('label');
    let input = document.createElement('input');

    label.setAttribute('for',`${category}-${name}`);
    label.textContent = capitalizeFirstLetter(category);
    
    input.setAttribute('type','number');
    input.setAttribute('name',`${category}-${name}`);
    input.setAttribute('id',`${category}-${name}`)
    input.disabled = true;

    let container = document.createElement('div');
    container.classList.add('number-part');
    container.append(label,input);
    return container;
}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function openTemplateCreation(event){
    //Create page loading if data-id for this template shows something aka for edition
    createTemplateDialog.showModal();
}

function tryCreatingTemplateField(){
    let fieldName = document.querySelector("[name='field-name']").value;
    let fieldType = document.querySelector("[name='field-type']").value;

    if(!fieldName || !fieldType){
        alert('empty!');
        return;
    }

    newWorkoutField = new WorkoutField(fieldName,fieldType);
    newWorkoutField.generateWorkoutField();

}

function onTemplateCreationCancel(event){
    //alert("DON'T MINIMIZE ME GREY!");
    //alert("YOU MUSTN'T MINIMIZE ME");
    //event.preventDefault();
}