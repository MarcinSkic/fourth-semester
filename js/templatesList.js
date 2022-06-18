/*
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
	}
};

fetch('https://exercisedb.p.rapidapi.com/exercises', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));*/

class WorkoutTemplate{

    constructor(){
        this.name = '';
        this.place = '';
        this.fields = [];
    }

    addField(workoutField){
        this.fields.push(workoutField);
    }

    generateWorkoutTemplateDialog(){
        dialog.innerHTML = 
        '<form class="create-template-form" method="dialog">' +
            '<h2>Create workout template</h2>'+
            `<div>` +
                `<label for="template-name">Name: </label>` +
                `<input type="text" name="template-name" id="template-name" placeholder="What is it, when is it?" required>` +
            `</div>` +
            `<div>` +
                `<label for="place">Place: </label>` +
                `<input type="text" name="place" id="place" list="places" placeholder="Optional">` +
            `</div>` +
            `<datalist id="places">` +
                `<option value="Gym">Gym</option>` +
            `</datalist>` +
            `<div class="fields-list">` +
                `<div class="add-new-field">` +
                    `<input type="text" name="field-name" placeholder="Field Name">` +
                    `<div class="field-options">` +
                        `<select name="field-type" id="">` +
                            `<option value="sets-and-reps" title="Example: plank">Sets and Reps</option>` +
                            `<option value="sets-and-reps-with-weight" title="Example: Bench pressing">Sets and Reps with Weight</option>` +
                            `<option value="numerical" title="Example: kilometers run, calories burned">Numerical</option>` + 
                            `<option value="checkbox" title="Example: Eaten before">Checkbox</option>` +
                        `</select>` +
                        `<button type="button" class="add-field-button">+</button>` +
                    `</div>` +
                `</div>` +
            `</div>` +
            `<button type="submit">Create template</button>` +
        `</form>`;
    }

    generateWorkoutTemplate(){
        const template = document.createElement('div');

        const templateName = document.createElement('span');
        templateName.textContent = this.name;

        const templatePlace = document.createElement('span');
        templatePlace.textContent = this.place;

        template.append(templateName,templatePlace)

        templatesContainer.append(template);
    }
}

class WorkoutField{
    constructor(name,type){
        this.name = name;
        this.type = type;
    }

    //W tej i innych pokrewnych metodach nie używam innerHTML ponieważ użytkownik wprowadza dane, co grozi HTML injection
    generateNewWorkoutField(){
        let newField = document.createElement('div');   //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie klasy
        newField.classList.add("template-field");

        let span = document.createElement('span');  //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie klasy
        span.classList.add('field-name');
        span.textContent = this.name; //Zabezpieczenie przed HTML injection

        newField.appendChild(span); //Dodanie elementu span jako dziecka

        if(this.type.includes("sets-and-reps")){    //Jeżeli typ pola zawiera nazwę "sets-and-reps"
            newField.appendChild(generateNumberPart('sets',this.name,true));    //Dodaj elementy
            newField.appendChild(generateNumberPart('reps',this.name,true));
            if(this.type === "sets-and-reps-with-weight"){  //Jeżeli jest równe temu typowi
                newField.appendChild(generateNumberPart('weight',this.name,true));  //Dodaj kolejny element
            }
        }
        
        if(this.type === 'checkbox'){
            newField.appendChild
        }

        const addNewField = document.querySelector(".add-new-field");   //Znajdź element tworzenia nowych pól, żeby dodawać pola przed nim
        const fieldsContainer = document.querySelector(".fields-list"); //Znajdź element przechowujący wszystkie pola
        fieldsContainer.insertBefore(newField,addNewField); //Dodaj nowe pole przed elementem tworzącym pola
    }

    generateWorkoutField(){
        //Used to generate fields of existing templates 
    }

    generateWorkoutFieldTitle(){

    }
}

const addTemplateButton = document.querySelector(".create-new-template-button");
const dialog = document.querySelector("dialog");
const templatesContainer = document.querySelector(".templates-container");

addTemplateButton.addEventListener('click',openTemplateCreation);

const LOC_STORAGE_TEMPLATES_LIST = 'templatesList';

currentOpenedWorkoutTemplate = new WorkoutTemplate();
generateTemplates();

function generateTemplates(){
    let templatesList = getTemplatesList();
    console.log(templatesList);
    templatesList.forEach(element => {
        element = Object.assign(new WorkoutTemplate(),element);
        element.generateWorkoutTemplate();
    });
}

function generateNumberPart(category,name,isDisabled){
    let label = document.createElement('label');
    let input = document.createElement('input');

    label.setAttribute('for',`${category}-${name}`);
    label.textContent = capitalizeFirstLetter(category);
    
    input.setAttribute('type','number');
    input.setAttribute('name',`${category}-${name}`);
    input.setAttribute('id',`${category}-${name}`)
    input.disabled = isDisabled;

    let container = document.createElement('div');
    container.classList.add('number-part');
    container.append(label,input);
    return container;
}

function generateCheckboxPart(){

}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function openTemplateCreation(event){
    //Create page loading if data-id for this template shows something aka for edition
    currentOpenedWorkoutTemplate = new WorkoutTemplate();
    currentOpenedWorkoutTemplate.generateWorkoutTemplateDialog();

    const createTemplateForm = document.querySelector(".create-template-form");
    createTemplateForm.addEventListener('submit',onTemplateSubmission);

    const addTemplateField = document.querySelector(".add-field-button");
    addTemplateField.addEventListener('click',tryCreatingTemplateField);

    const templateName = document.querySelector("#template-name");
    templateName.addEventListener('change',onTemplateNameChange);

    dialog.addEventListener('cancel',onTemplateCreationCancel);

    dialog.showModal();
}

function tryCreatingTemplateField(){
    let fieldName = document.querySelector("[name='field-name']").value;
    let fieldType = document.querySelector("[name='field-type']").value;

    if(!fieldName || !fieldType){
        alert('empty!');
        return;
    }

    newWorkoutField = new WorkoutField(fieldName,fieldType);
    newWorkoutField.generateNewWorkoutField();

    currentOpenedWorkoutTemplate.addField(newWorkoutField);
}

function onTemplateNameChange(event){
    templatesList = getTemplatesList();

    if(templatesList.find(element => element.name === event.target.value)){
        event.target.setCustomValidity("There already exists template with that name");
    } else {
        event.target.setCustomValidity("");
    }
    //TODO: Add CSS warning that this name is taken
}

function onTemplateSubmission(event){
    if(currentOpenedWorkoutTemplate.fields.length === 0){
        alert("Template must have at least one field");
        event.preventDefault();
        return;
    }

    let templateName = document.querySelector('#template-name');
    let templatePlace = document.querySelector('#place');

    currentOpenedWorkoutTemplate.name = templateName.value;
    currentOpenedWorkoutTemplate.place = templatePlace.value;

    templatesList = getTemplatesList();

    templatesList.push(currentOpenedWorkoutTemplate);

    localStorage.setItem(LOC_STORAGE_TEMPLATES_LIST,JSON.stringify(templatesList));

    currentOpenedWorkoutTemplate = null;
}

function getTemplatesList(){
    let templatesList = JSON.parse(localStorage.getItem(LOC_STORAGE_TEMPLATES_LIST));

    if(templatesList == null) templatesList = [];

    return templatesList;
}

function onTemplateCreationCancel(event){
    if(currentOpenedWorkoutTemplate.fields.length !== 0){
        if(!window.confirm("Are you sure you want to cancel edition of this template?")){
            event.preventDefault();
        }
    }
}