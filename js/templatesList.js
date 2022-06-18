let addTemplateButton = document.querySelector(".create-new-template-button");
let createTemplateDialog = document.querySelector(".create-template-dialog");
let addTemplateField = document.querySelector(".add-field-button");
let addNewField = document.querySelector(".add-new-field");
let fieldsContainer = document.querySelector(".fields-list");

addTemplateButton.addEventListener('click',openTemplateCreation);
createTemplateDialog.addEventListener('cancel',onTemplateCreationCancel);
addTemplateField.addEventListener('click',tryAddingTemplateField);

class WorkoutTemplate{
    constructor(name,place){
        this.name = name;
        this.place = place;
        this.fields = [];
    }

    addField(name, type){
        this.fields.push(new WorkoutField(name,type));
    }

    generateHTMLTemplate(){

    }
}

class WorkoutField{
    constructor(name,type){
        this.name = name;
        this.type = type;
    }

    generateHTMLField(newField){    
        let span = document.createElement('span');
        span.classList.add('field-name');
        span.textContent = this.name; //Zabezpieczenie przed HTML injection
        newField.appendChild(span);

        let result = "";
        if(this.type.includes("sets-and-reps")){
            result += `<label for="sets-${this.name}">Sets</label>` +   //Moze zamienic na metodę która będzie dodawać?
            `<input type="number" name="sets-${this.name}" id="sets-${this.name}" disabled>` +
            `<label for="reps-${this.name}">Reps</label>` +
            `<input type="number" name="reps-${this.name}" id="reps-${this.name}" disabled>`;
            if(this.type === "sets-and-reps-with-weight"){
                result += `<label for="weights-${this.name}">Weights</label>` +
                `<input type="number" name="sets-${this.name}" id="sets-${this.name}" disabled>`;
            }
        }
        
        if(this.type === 'checkbox'){

        }

        newField.innerHTML += result;
    }
}

let currentEditedTemplate;

function openTemplateCreation(event){
    //Create page loading if data-id for this template shows something aka for edition
    createTemplateDialog.showModal();
    currentEditedTemplate = "";
}

function tryAddingTemplateField(){
    let fieldName = document.querySelector("[name='field-name']").value;
    let fieldType = document.querySelector("[name='field-type']").value;

    if(!fieldName || !fieldType){
        alert('empty!');
        return;
    }

    newWorkoutField = new WorkoutField(fieldName,fieldType);

    let newField = document.createElement('div');
    newField.classList.add("template-field");
    
    newWorkoutField.generateHTMLField(newField);

    fieldsContainer.insertBefore(newField,addNewField);
}

function onTemplateCreationCancel(event){
    //alert("DON'T MINIMIZE ME GREY!");
    //alert("YOU MUSTN'T MINIMIZE ME");
    //event.preventDefault();
}