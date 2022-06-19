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

class WorkoutSession {
    constructor(){
        this.template = null;
        this.date = null;
    }

    generateWorkoutSessionDialog(){
        dialog.innerHTML = 
        '<form class="create-session-form" method="dialog">' +
            '<h2>Log workout session</h2>'+
            '<div class="session-header">'+
                `<div>` +
                    `<label for="pick-template">Name: </label>` +
                    '<select name="pick-template" id="pick-template" required></select>'+
                `</div>` +
                `<div>` +
                    `<label for="date">Date: </label>` +
                    `<input type="date" name="date" id="date" required>` +
                `</div>` +
            '</div>'+
            `<div class="template-form">` +
            `</div>` +
            `<button type="submit">Log session</button>` +
        `</form>`;
        
        const pickTemplate = document.querySelector('#pick-template');
        const templatesList = getTemplatesList();

        templatesList.forEach((workoutTemplate,index) => {
            if(index === 0){
                workoutTemplate = Object.assign(new WorkoutTemplate(),workoutTemplate);
                workoutTemplate.generateWorkoutForm();
            }

            let option = document.createElement('option');
            option.setAttribute('value',workoutTemplate.name);
            option.textContent = workoutTemplate.name;

            pickTemplate.append(option);
        });
    }
}

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
            `</div>` +
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

    generateWorkoutForm(){
        const templateForm = document.querySelector('.template-form');

        templateForm.innerHTML = '';

        const templateName = document.createElement('span');
        templateName.textContent = this.name;

        const templatePlace = document.createElement('span');
        templatePlace.textContent = this.place;

        templateForm.append(templateName,templatePlace);

        const templateFormContainer = document.createElement('div');
        templateFormContainer.classList.add('template-form-container');

        templateForm.append(templateFormContainer);

        this.fields.forEach(field => {
            field = Object.assign(new WorkoutField(),field);
            console.log(field);
            field.generateWorkoutField(templateFormContainer,false,true);
        })
    }
}

class WorkoutField{
    constructor(name,type){
        this.name = name;
        this.type = type;
        this.values = {};
    }

    //W tej i innych pokrewnych metodach nie używam innerHTML ponieważ użytkownik wprowadza dane, co grozi HTML injection
    generateWorkoutField(whereToAppend,isDisabled,isRequired){
        let newField = document.createElement('div');   //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie klasy
        newField.classList.add("template-field");
        newField.dataset.name = this.name;

        let span = document.createElement('span');  //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie klasy
        span.classList.add('field-name');
        span.textContent = this.name; //Zabezpieczenie przed HTML injection

        newField.appendChild(span); //Dodanie elementu span jako dziecka

        if(this.type.includes("sets-and-reps")){    //Jeżeli typ pola zawiera nazwę "sets-and-reps"
            newField.appendChild(this.createNumberPart('sets',this.name,isDisabled,isRequired));    //Dodaj elementy
            newField.appendChild(this.createNumberPart('reps',this.name,isDisabled,isRequired));
            if(this.type === "sets-and-reps-with-weight"){  //Jeżeli jest równe temu typowi
                newField.appendChild(this.createNumberPart('weight',this.name,isDisabled,isRequired));  //Dodaj kolejny element
            }
        }
        
        if(this.type === 'checkbox'){
            newField.appendChild(this.createCheckboxPart('checkbox',this.name,isDisabled));
        }

        if(this.type === 'numerical'){
            newField.appendChild(this.createNumberPart('numerical',this.name,isDisabled,isRequired));
        }
        
        whereToAppend.append(newField); //Dodaj nowe pole przed elementem tworzącym pola
    }

    createNumberPart(category,name,isDisabled,isRequired){
        let label = document.createElement('label');
        let input = document.createElement('input');
    
        label.setAttribute('for',`${category}-${name}`);
        label.textContent = capitalizeFirstLetter(category);
        
        input.setAttribute('type','number');
        input.setAttribute('name',`${category}-${name}`);
        input.setAttribute('id',`${category}-${name}`);
        input.disabled = isDisabled;
        input.required = isRequired;
    
        let container = document.createElement('div');
        container.classList.add('number-part');
    
        if(category !== 'numerical'){
            container.append(label);
        }
    
        container.append(input);
        
        return container;
    }

    createCheckboxPart(category,name,isDisabled){
        let input = document.createElement('input');
        
        input.setAttribute('type','checkbox');
        input.setAttribute('name',`${category}-${name}`);
        input.setAttribute('id',`${category}-${name}`)
        input.disabled = isDisabled;
    
        let container = document.createElement('div');
        container.classList.add('checkbox-part');
        container.append(input);
        return container;
    }
}

const dialog = document.querySelector("dialog");

const addTemplateButton = document.querySelector(".create-new-template-button");
const templatesContainer = document.querySelector(".templates-container");

if(addTemplateButton != null){  //TODO fix if splitted to different scripts
    addTemplateButton.addEventListener('click',openTemplateCreation);
}

const LOC_STORAGE_TEMPLATES_LIST = 'templatesList';
const LOC_STORAGE_SESSIONS_LIST = 'sessionsList';

currentOpenedWorkoutTemplate = new WorkoutTemplate();
if(templatesContainer != null){ //TODO fix if splitted to different scripts
    generateTemplates();
}

function generateTemplates(){
    templatesContainer.innerHTML = "";
    
    let templatesList = getTemplatesList();
    console.log(templatesList);
    templatesList.forEach(element => {
        element = Object.assign(new WorkoutTemplate(),element);
        element.generateWorkoutTemplate();
    });
}

function openTemplateCreation(event){
    //Create page loading if data-id for this template shows something aka for edition
    currentOpenedWorkoutTemplate = new WorkoutTemplate();
    currentOpenedWorkoutTemplate.generateWorkoutTemplateDialog();

    const templateName = document.querySelector("#template-name");
    templateName.addEventListener('input',onTemplateNameChange);

    const addTemplateField = document.querySelector(".add-field-button");
    addTemplateField.addEventListener('click',tryCreatingTemplateField);

    const submitButton = document.querySelector("[type='submit']");
    submitButton.addEventListener('click',tryTemplateSubmission);

    const createTemplateForm = document.querySelector(".create-template-form");
    createTemplateForm.addEventListener('submit',onTemplateSubmission);

    dialog.addEventListener('cancel',onTemplateCreationCancel);

    dialog.showModal();
}

function onTemplateNameChange(event){
    templatesList = getTemplatesList();

    if(templatesList.find(element => element.name === event.target.value)){
        event.target.setCustomValidity("There already exists template with that name");
    } else {
        event.target.setCustomValidity("");
    }
}


function tryCreatingTemplateField(){
    const fieldName = document.querySelector("[name='field-name']");
    const fieldType = document.querySelector("[name='field-type']");
    const fieldsContainer = document.querySelector(".fields-list"); //Znajdź element przechowujący wszystkie pola

    if(!fieldName.value || !fieldType.value){
        fieldName.setCustomValidity("Field name can't be empty");
        fieldName.reportValidity();
        return;
    } else {
        fieldName.setCustomValidity("");
    }

    if(currentOpenedWorkoutTemplate.fields.find(element => element.name === fieldName.value)){
        fieldName.setCustomValidity("Already exists field with that name");
        fieldName.reportValidity();
        return;
    } else {
        fieldName.setCustomValidity("");
    }

    newWorkoutField = new WorkoutField(fieldName.value,fieldType.value);
    newWorkoutField.generateWorkoutField(fieldsContainer,true,false);

    currentOpenedWorkoutTemplate.addField(newWorkoutField);
}

function tryTemplateSubmission(event){
    const field = document.querySelector("[name='field-name']");
    if(currentOpenedWorkoutTemplate.fields.length === 0){
        field.setCustomValidity("Template must have at least one field");
        if(field.value){
            field.setCustomValidity("Template must have at least one field (click '+' button to add)");
        }
        return;
    } else {
        field.setCustomValidity("");
    }
}

function onTemplateSubmission(event){

    let templateName = document.querySelector('#template-name');
    let templatePlace = document.querySelector('#place');

    currentOpenedWorkoutTemplate.name = templateName.value;
    currentOpenedWorkoutTemplate.place = templatePlace.value;

    templatesList = getTemplatesList();

    templatesList.push(currentOpenedWorkoutTemplate);

    localStorage.setItem(LOC_STORAGE_TEMPLATES_LIST,JSON.stringify(templatesList));

    generateTemplates();
    currentOpenedWorkoutTemplate = null;
}

function onTemplateCreationCancel(event){
    if(currentOpenedWorkoutTemplate.fields.length !== 0){
        if(!window.confirm("Are you sure you want to cancel edition of this template?")){
            event.preventDefault();
        }
    }
}

//SESSION-SITE-SECTION

const logSessionButton = document.querySelector('.create-new-session-button');
logSessionButton.addEventListener('click',openSessionCreation);

let currentOpenedSession;

function openSessionCreation(event){
    currentOpenedSession = new WorkoutSession();
    currentOpenedSession.generateWorkoutSessionDialog();

    const pickTemplate = document.querySelector('#pick-template');
    pickTemplate.addEventListener('input',tryGeneratingWorkoutForm);

    const createTemplateForm = document.querySelector(".create-session-form");
    createTemplateForm.addEventListener('submit',onSessionSubmission);

    dialog.showModal();
}

function tryGeneratingWorkoutForm(event){
    let workoutTemplate = getTemplatesList().find(element => element.name === getSelectOptionName(event.target));

    workoutTemplate = Object.assign(new WorkoutTemplate(),workoutTemplate);

    workoutTemplate.generateWorkoutForm();
}

function onSessionSubmission(event){
    const pickTemplate = document.querySelector('#pick-template');
    const templateName = getSelectOptionName(pickTemplate);

    const templatesList = getTemplatesList();
    let templateToSubmit = templatesList.find(template => template.name === templateName);

    templateToSubmit.fields.forEach(field => {
        const fieldsInputs = document.querySelectorAll(`[data-name="${field.name}"] input`);

        values = {};
        fieldsInputs.forEach(fieldInput => {
            let type = fieldInput.id.replace('-'+field.name,'');
            if(type === 'checkbox'){
                values[type] = fieldInput.checked;
            } else {
                values[type] = fieldInput.value;
            }
        });
        
        field.values = values;
    });

    let date = document.querySelector('#date').value;

    currentOpenedSession.template = templateToSubmit;
    currentOpenedSession.date = date;

    console.log(currentOpenedSession);
}

//USED-BY-EVERYONE
function getTemplatesList(){
    let templatesList = JSON.parse(localStorage.getItem(LOC_STORAGE_TEMPLATES_LIST));

    if(templatesList == null) templatesList = [];

    return templatesList;
}

function getSelectOptionName(select){
    return select.options[select.selectedIndex].text;
}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}