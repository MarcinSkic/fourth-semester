
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f7718aba17msh988a6d5c697e3a6p12ffa7jsn88d6576b411c',
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
	}
};

fetch('https://exercisedb.p.rapidapi.com/exercises', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));

class WorkoutSession {
    constructor(){
        this.template = null;
        this.date = null;
    }

    generateWorkoutSessionDialog(mode){
        dialog.innerHTML = 
        '<form class="create-session-form" method="dialog">' +
            `<h2>${mode} workout session</h2>`+
            
            `<div class='header-container'>` +
                `<label for="pick-template">Name: </label>` +
                '<select name="pick-template" id="pick-template" required></select>'+
            `</div>` +
            `<div class='header-container'>` +
                `<label for="date">Date: </label>` +
                `<input type="date" name="date" id="date" required>` +
            `</div>` +

            `<div class="template-form">` +
            `</div>` +
            `<button type="submit">${mode} session</button>` +
        `</form>`;
        
        const pickTemplate = document.querySelector('#pick-template');
        const templatesList = getTemplatesList();


        templatesList.forEach((workoutTemplate,index) => {
            if(index === 0 && mode === 'Log'){
                workoutTemplate = Object.assign(new WorkoutTemplate(),workoutTemplate);
                workoutTemplate.generateWorkoutForm();
            }
            
            let option = document.createElement('option');
            option.setAttribute('value',workoutTemplate.name);
            option.textContent = workoutTemplate.name;

            pickTemplate.append(option);
        });
    }

    generateWorkoutSession(){
        const session = document.createElement('div');

        const sessionTemplate = document.createElement('span');
        sessionTemplate.textContent = this.template.name;

        const sessionDate = document.createElement('span');
        sessionDate.textContent = this.date;

        const buttonsContainer = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.classList.add('edit');
        editButton.dataset.date = this.date;

        editButton.addEventListener('click',openSessionCreation);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete');
        deleteButton.dataset.date = this.date;
        
        deleteButton.addEventListener('click',deleteSession);

        buttonsContainer.append(editButton,deleteButton);

        session.append(sessionTemplate,sessionDate,buttonsContainer);

        sessionsContainer.append(session);
    }

    loadDataIntoForm(){
        const pickTemplate = document.querySelector('#pick-template');
        [...pickTemplate.options].find(option => option.text === this.template.name).selected = true;

        const dateInput = document.querySelector('#date');
        dateInput.value = this.date;

        Object.assign(new WorkoutTemplate(),this.template).generateWorkoutForm();

        this.template.fields.forEach(field => {
            if(field.type.includes('sets')){
                document.querySelector(`#sets-${field.name}`).value = field.values['sets'];
            }
            if(field.type.includes('reps')){
                document.querySelector(`#reps-${field.name}`).value = field.values['reps'];
            }
            if(field.type.includes('weight')){
                document.querySelector(`#weight-${field.name}`).value = field.values['weight'];
            }
            if(field.type.includes('checkbox')){
                document.querySelector(`#checkbox-${field.name}`).checked = field.values['checkbox'];
            }
            if(field.type.includes('numerical')){
                document.querySelector(`#numerical-${field.name}`).value = field.values['numerical'];
            }
        });
    }
}
/*
const templateNameInput = document.querySelector('input#template-name');
        templateNameInput.value = this.name;

        const templatePlaceInput = document.querySelector('input#place');
        templatePlaceInput.value = this.place;

        const fieldsContainer = document.querySelector(".fields-list"); //Znajdź element przechowujący wszystkie pola

        this.fields.forEach(field => {
            field = Object.assign(new WorkoutField(),field);
            field.generateWorkoutField(fieldsContainer,true,false);
        });
        */

class WorkoutTemplate{

    constructor(){
        this.name = '';
        this.place = '';
        this.fields = [];
    }

    addField(workoutField){
        this.fields.push(workoutField);
    }

    generateWorkoutTemplateDialog(mode){
        dialog.innerHTML = 
        '<form class="create-template-form" method="dialog">' +
            `<h2>${mode} workout template</h2>`+
            `<div class="header-container">` +
                `<label for="template-name">Name</label>` +
                `<input type="text" name="template-name" id="template-name" placeholder="What is it, when is it?" required>` +
            `</div>` +
            `<div class="header-container">` +
                `<label for="place">Place</label>` +
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
            `<button type="submit">${mode} template</button>` +
        `</form>`;
    }

    generateWorkoutTemplate(){
        const template = document.createElement('div');

        const templateName = document.createElement('div');
        templateName.classList.add('template-element-name');
        templateName.textContent = this.name;

        const templatePlace = document.createElement('div');
        templatePlace.classList.add('template-element-place');
        templatePlace.textContent = this.place;


        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('template-element-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        editButton.classList.add('edit');
        editButton.dataset.name = this.name;

        editButton.addEventListener('click',openTemplateCreation);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete');
        deleteButton.dataset.name = this.name;

        deleteButton.addEventListener('click',deleteTemplate);

        buttonsContainer.append(editButton,deleteButton);

        template.append(templateName,templatePlace,buttonsContainer)

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

    loadDataIntoForm(){
        const templateNameInput = document.querySelector('input#template-name');
        templateNameInput.value = this.name;

        const templatePlaceInput = document.querySelector('input#place');
        templatePlaceInput.value = this.place;

        const fieldsContainer = document.querySelector(".fields-list"); //Znajdź element przechowujący wszystkie pola

        this.fields.forEach(field => {
            field = Object.assign(new WorkoutField(),field);
            field.generateWorkoutField(fieldsContainer,true,false);
        });
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
editedTemplateIndex = -1;
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

function deleteTemplate(event){
    if(!window.confirm("Warning, this will delete all sessions based on this template!")){
        return;
    }
    const templateToDeleteName = event.target.dataset.name;

    let newSessionsList = [];
    const sessionsList = getSessionsList();
    sessionsList.forEach(session =>{
        if(session.template.name !== templateToDeleteName){
            newSessionsList.push(session);
        }
    })
    localStorage.setItem(LOC_STORAGE_SESSIONS_LIST,JSON.stringify(newSessionsList));

    const templateList = getTemplatesList();
    const index = templateList.indexOf(templateList.find(template => template.name === templateToDeleteName));
    templateList.splice(index,1);
    localStorage.setItem(LOC_STORAGE_TEMPLATES_LIST,JSON.stringify(templateList));

    generateTemplates();
}

function openTemplateCreation(event){

    new WorkoutTemplate().generateWorkoutTemplateDialog();

    const existingTemplateName = event.target.dataset.name;

    if(existingTemplateName != null){
        new WorkoutTemplate().generateWorkoutTemplateDialog('Edit');

        const templatesList = getTemplatesList();
        let template = templatesList.find(template => template.name == existingTemplateName);
        currentOpenedWorkoutTemplate = Object.assign(new WorkoutTemplate(),template);
        currentOpenedWorkoutTemplate.loadDataIntoForm();

        editedTemplateIndex = templatesList.indexOf(template);

        const createTemplateForm = document.querySelector(".create-template-form");
        createTemplateForm.addEventListener('submit',onTemplateEdition);
    } else {
        new WorkoutTemplate().generateWorkoutTemplateDialog('Create');

        const createTemplateForm = document.querySelector(".create-template-form");
        createTemplateForm.addEventListener('submit',onTemplateSubmission);
        
        currentOpenedWorkoutTemplate = new WorkoutTemplate();
    }

    const templateName = document.querySelector("#template-name");
    templateName.addEventListener('input',onTemplateNameChange);
    
    const addTemplateField = document.querySelector(".add-field-button");
    addTemplateField.addEventListener('click',tryCreatingTemplateField);

    const submitButton = document.querySelector("[type='submit']");
    submitButton.addEventListener('click',tryTemplateSubmission);

    dialog.addEventListener('cancel',onTemplateCreationCancel);

    dialog.showModal();
}

function onTemplateEdition(event){
    let templateName = document.querySelector('#template-name');
    let templatePlace = document.querySelector('#place');

    currentOpenedWorkoutTemplate.name = templateName.value;
    currentOpenedWorkoutTemplate.place = templatePlace.value;

    templatesList = getTemplatesList();

    templatesList[editedTemplateIndex] = currentOpenedWorkoutTemplate;

    localStorage.setItem(LOC_STORAGE_TEMPLATES_LIST,JSON.stringify(templatesList));

    generateTemplates();
    currentOpenedWorkoutTemplate = null;
    editedTemplateIndex = -1;
}

function onTemplateNameChange(event){
    templatesList = getTemplatesList();
    if(event.target.value.includes(' ')){
        event.target.setCustomValidity("Template name can't contain white space");
        return;
    } else {
        event.target.setCustomValidity("");
    }

    if(templatesList.find(element => element.name === event.target.value)){
        event.target.setCustomValidity("There already exists template with that name");
        return
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

    if(fieldName.value.includes(' ')){
        fieldName.setCustomValidity("Field name can't contain white spaces");
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
    currentOpenedWorkoutTemplate = null;
}

//SESSION-SITE-SECTION

const logSessionButton = document.querySelector('.create-new-session-button');
const sessionsContainer = document.querySelector(".sessions-container");

if(logSessionButton != null){
    logSessionButton.addEventListener('click',openSessionCreation);
}

let currentOpenedSession;
let editedSessionIndex = -1;
if(sessionsContainer != null){
    generateSessions();
}

function generateSessions(){
    sessionsContainer.innerHTML = "";

    let sessionsList = getSessionsList();
    sessionsList.forEach(session => {
        session = Object.assign(new WorkoutSession(),session);
        session.generateWorkoutSession();
    });
}
    /*
    const existingTemplateName = event.target.dataset.name;

    if(existingTemplateName != null){
        new WorkoutTemplate().generateWorkoutTemplateDialog('Edit');

        const templatesList = getTemplatesList();
        let template = templatesList.find(template => template.name === existingTemplateName);
        currentOpenedWorkoutTemplate = Object.assign(new WorkoutTemplate(),template);
        currentOpenedWorkoutTemplate.loadDataIntoForm();

        editedTemplateIndex = templatesList.indexOf(template);

        const createTemplateForm = document.querySelector(".create-template-form");
        createTemplateForm.addEventListener('submit',onTemplateEdition);
    } else {
        new WorkoutTemplate().generateWorkoutTemplateDialog('Create');

        const createTemplateForm = document.querySelector(".create-template-form");
        createTemplateForm.addEventListener('submit',onTemplateSubmission);
    }*/

function openSessionCreation(event){
    const existingSessionDate = event.target.dataset.date;

    if(existingSessionDate != null) {
        new WorkoutSession().generateWorkoutSessionDialog('Edit');

        const sessionsList = getSessionsList();
        let session = sessionsList.find(session => session.date === existingSessionDate);
        currentOpenedSession = Object.assign(new WorkoutSession(),session);
        currentOpenedSession.loadDataIntoForm();

        editedSessionIndex = sessionsList.indexOf(session);

        const createTemplateForm = document.querySelector(".create-session-form");
        createTemplateForm.addEventListener('submit',onSessionEdition);
    } else {
        new WorkoutSession().generateWorkoutSessionDialog('Log');

        const createTemplateForm = document.querySelector(".create-session-form");
        createTemplateForm.addEventListener('submit',onSessionSubmission);
        currentOpenedSession = new WorkoutSession();
    }

    const pickTemplate = document.querySelector('#pick-template');
    pickTemplate.addEventListener('input',tryGeneratingWorkoutForm);

    const dateInput = document.querySelector('#date');
    dateInput.addEventListener('input',onDateChange);

    dialog.showModal();
}

function deleteSession(event){
    const sessionToDeleteDate = event.target.dataset.date;

    const sessionList = getSessionsList();
    const index = sessionList.indexOf(sessionList.find(session => session.date === sessionToDeleteDate));
    
    sessionList.splice(index,1);
    localStorage.setItem(LOC_STORAGE_SESSIONS_LIST,JSON.stringify(sessionList));
    generateSessions();
}

function onSessionEdition(){
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

    sessionsList = getSessionsList();
    sessionsList[editedSessionIndex] = currentOpenedSession;
    localStorage.setItem(LOC_STORAGE_SESSIONS_LIST,JSON.stringify(sessionsList));

    generateSessions();
    currentOpenedSession = null;
}

function onDateChange(event){
    let sessionList = getSessionsList();

    if(sessionList.find(element => element.date === event.target.value)){
        event.target.setCustomValidity("There already exists session with that date");
    } else {
        event.target.setCustomValidity("");
    }
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
            let type = fieldInput.id.replace('-'+field.name,'');;
            if(type.includes('checkbox')){
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

    sessionsList = getSessionsList();
    sessionsList.push(currentOpenedSession);
    localStorage.setItem(LOC_STORAGE_SESSIONS_LIST,JSON.stringify(sessionsList));

    generateSessions();
    currentOpenedSession = null;
}

//USED-BY-EVERYONE
function getSessionsList(){
    let sessionsList = JSON.parse(localStorage.getItem(LOC_STORAGE_SESSIONS_LIST));

    if(sessionsList == null) sessionsList = [];

    return sessionsList;
}

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