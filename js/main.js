class WorkoutSession {  //Klasa przechowująca dane o sesji treningowej
    constructor(){
        this.template = null;   //Użyty wzór przy zapisywaniu sesji
        this.date = null;   //Data odbytego treningu
    }

    generateWorkoutSessionDialog(mode){ //Metoda tworząca wyskakujące okno do wypełniania sesji
        dialog.innerHTML = //Dynamiczne stworzenie okna pozwalającego wypełnić sesję
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
        
        const pickTemplate = document.querySelector('#pick-template');  //Znalezienie elementu select przechowującego dostępne wzory
        const templatesList = getTemplatesList();   //Pobranie listy wzorów z localStorage


        templatesList.forEach((workoutTemplate,index) => {  //Dla kazdego wzoru..
            if(index === 0 && mode === 'Log'){  //Pierwszy wzor zostaje wygenerowany jeżeli jest tryb tworzenia po raz pierwszy 'Log'
                workoutTemplate = Object.assign(new WorkoutTemplate(),workoutTemplate); //Zamiana zwykłego obiektu na obiekt klasy wzorów żeby mieć dostęp do metody
                workoutTemplate.generateWorkoutForm();
            }
            
            let option = document.createElement('option');  //..Stworzenie opcji w elemencie select..
            option.setAttribute('value',workoutTemplate.name);//..nadanie odpowiedniej wartości..
            option.textContent = workoutTemplate.name;

            pickTemplate.append(option);    //..i dodanie do DOM
        });
    }

    generateWorkoutSession(){   //Metoda tworząca sesję treningową w DOM
        const session = document.createElement('div');  //Stworzenie ogólnego kontenera

        const sessionTemplate = document.createElement('span'); //Stworzenie i nadanie wartości pola z nazwą wzoru użytego w sesji
        sessionTemplate.textContent = this.template.name;

        const sessionDate = document.createElement('span'); //Stworzenie i nadanie wartośći pola z datą odbycia sesji
        sessionDate.textContent = this.date;

        const buttonsContainer = document.createElement('div'); //Kontener na przyciski

        const editButton = document.createElement('button');    //Przycisk edycji z parametrami
        editButton.textContent = "Edit";
        editButton.classList.add('edit');
        editButton.dataset.date = this.date;    //Dodanie do przycisku atrybutu o formacie data-<wartość> w celu identyfikacji do jakiej sesji on należy w momencie wywołania metody

        editButton.addEventListener('click',openSessionCreation);   //Dodanie wywołania metody otwierającej okienko edycji przy kliknięciu

        const deleteButton = document.createElement('button');  //Przycisk usuwania z parametrami
        deleteButton.textContent = "Delete";
        deleteButton.classList.add('delete');
        deleteButton.dataset.date = this.date; //Dodanie do przycisku atrybutu o formacie data-<wartość> w celu identyfikacji do jakiej sesji on należy w momencie wywołania metody
        
        deleteButton.addEventListener('click',deleteSession);   //Dodanie wywołania metody usuwania sesji

        buttonsContainer.append(editButton,deleteButton);   //Dodanie elementów do rodziców
        session.append(sessionTemplate,sessionDate,buttonsContainer);
        sessionsContainer.append(session);
    }

    loadDataIntoForm(){ //Metoda załadowująca istniejące dane do wyświetlenia
        const pickTemplate = document.querySelector('#pick-template');  //Znalezienie elementu select przechowującego dostępne wzory
        [...pickTemplate.options].find(option => option.text === this.template.name).selected = true;   //Znalezienie i wybranie z listy wzoru który ma ten obiekt sesji

        const dateInput = document.querySelector('#date');  //Znalezienie i ustawienie wartości polu z datą
        dateInput.value = this.date;

        Object.assign(new WorkoutTemplate(),this.template).generateWorkoutForm();   //Wygenerowanie formularza na podstawie wzoru

        this.template.fields.forEach(field => { //Dla każdego pola sprawdź czy zawiera takie części i jeżeli tak to ustaw im zapisaną wartość
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

class WorkoutTemplate{  //Klasa przechowująca wzory treningów

    constructor(){  //Wzory składają się z: nazwy i różnych pól, opcjonalnie miejsca treningu
        this.name = '';
        this.place = '';
        this.fields = [];
    }

    addField(workoutField){ //Dodaj pole do wzoru
        this.fields.push(workoutField);
    }

    generateWorkoutTemplateDialog(mode){    //Wygenerowanie formularza do tworzenia wzorów
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

    generateWorkoutTemplate(){  //Metoda tworząca wzór treningowy w DOM
        //Metoda na tych samych zasadach co generateWorkoutSession, komentarze tam 
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

    generateWorkoutForm(){  //Metoda tworząca formularz do wypełnienia na podstawie wzoru
        const templateForm = document.querySelector('.template-form');  //Znajdź element przeznaczony do przechowywania formularza

        templateForm.innerHTML = '';    //Wyczyszczenie, tylko jeden formularz na raz może być wyświetlony

        const templateName = document.createElement('span');    //Nazwa wzoru
        templateName.textContent = this.name;

        const templatePlace = document.createElement('span');   //Miejsce odbywania treningów
        templatePlace.textContent = this.place;

        templateForm.append(templateName,templatePlace);    //Dodaj wygenerowane dane

        const templateFormContainer = document.createElement('div');    //Wygeneruj kontener na pola
        templateFormContainer.classList.add('template-form-container');

        templateForm.append(templateFormContainer);

        this.fields.forEach(field => {  //Dla każdego pola..
            field = Object.assign(new WorkoutField(),field);    //..wskaż że należy do klasy..
            field.generateWorkoutField(templateFormContainer,false,true);   //..wywołaj metodę która w oparciu o dane obiektu stworzy pole argumenty (false,true) sterują tym czy pole jest do edycji (sesja) czy tylko wyświetlania (wzór)
        })
    }

    loadDataIntoForm(){     //Metoda załadowująca istniejące dane do wyświetlenia
        const templateNameInput = document.querySelector('input#template-name');    //Ustaw nazwę wzoru
        templateNameInput.value = this.name;

        const templatePlaceInput = document.querySelector('input#place');   //Ustaw miejsce treningu wzoru
        templatePlaceInput.value = this.place;

        const fieldsContainer = document.querySelector(".fields-list"); //Znajdź element przechowujący wszystkie pola

        this.fields.forEach(field => {  //Dla każdego pola wzoru
            field = Object.assign(new WorkoutField(),field);    //..wskaż że należy do klasy..
            field.generateWorkoutField(fieldsContainer,true,false); //..wywołaj metodę która w oparciu o dane obiektu stworzy pole argumenty (true,false) sterują tym czy pole jest do edycji (sesja) czy tylko wyświetlania (wzór)
        });
    }
}

class WorkoutField{ //Pole sesji lub wzoru, może się składać z kilku części
    constructor(name,type){
        this.name = name;   //Nazwa pola
        this.type = type;   //Rodzaj pola
        this.values = {};   //Części z jakich się składa
    }

    //W tej i innych pokrewnych metodach nie używam innerHTML ponieważ użytkownik wprowadza dane, co grozi HTML injection
    generateWorkoutField(whereToAppend,isDisabled,isRequired){
        let newField = document.createElement('div');   //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie atrybutów
        newField.classList.add("template-field");
        newField.dataset.name = this.name;

        let span = document.createElement('span');  //Stworzenie elementu (jeszcze nie istnieje w DOM strony) i dodanie atrybutów
        span.classList.add('field-name');
        span.textContent = this.name;

        newField.appendChild(span); //Dodanie elementu span jako dziecka

        if(this.type.includes("sets-and-reps")){    //Jeżeli typ pola zawiera nazwę "sets-and-reps"
            newField.appendChild(this.createNumberPart('sets',this.name,isDisabled,isRequired));    //Dodaj elementy
            newField.appendChild(this.createNumberPart('reps',this.name,isDisabled,isRequired));
            if(this.type === "sets-and-reps-with-weight"){  //Jeżeli jest dokładnie tym type
                newField.appendChild(this.createNumberPart('weight',this.name,isDisabled,isRequired));  //Dodaj kolejny element
            }
        }
        
        if(this.type === 'checkbox'){//itd.
            newField.appendChild(this.createCheckboxPart('checkbox',this.name,isDisabled));
        }

        if(this.type === 'numerical'){
            newField.appendChild(this.createNumberPart('numerical',this.name,isDisabled,isRequired));
        }
        
        whereToAppend.append(newField); //Dodaj nowe pole do DOM
    }

    createNumberPart(category,name,isDisabled,isRequired){  //Stwórz liczbową część pola
        let label = document.createElement('label');    //Etykieta
        let input = document.createElement('input');    //Pole do wprowadzania wartości
    
        label.setAttribute('for',`${category}-${name}`);    //Unikatowa nazwa składająca się z typu i nazwy ogólnego pola
        label.textContent = capitalizeFirstLetter(category);    //Pierwsza litera z dużej
        
        input.setAttribute('type','number');    //Stworzenie pola i ustawienie parametrów
        input.setAttribute('name',`${category}-${name}`);
        input.setAttribute('id',`${category}-${name}`);
        input.disabled = isDisabled;
        input.required = isRequired;
    
        let container = document.createElement('div');  //Stworzenie pojemnika na przechowywanie elementów
        container.classList.add('number-part');
    
        if(category !== 'numerical'){   //Jeżeli pole jest typu liczbowego to nie potrzebna etykieta bo zawiera tylko jedną wartość, nazwa główna opisuje wystarczająco
            container.append(label);
        }
    
        container.append(input);
            
        return container; //Zwrócenie węzła HTMLowego który jeszcze nie jest dodany do DOM ale istnieje już w pamięci
    }

    createCheckboxPart(category,name,isDisabled){   //Stwórz przycisk tak/nie, podobnie jak powyżej
        let input = document.createElement('input');    //Stworzenie elementu i nadanie atrybutów, itd.
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

const dialog = document.querySelector("dialog");    //Wybranie elementu dialog, służącego do wyświetlania wyskakujących okien

const addTemplateButton = document.querySelector(".create-new-template-button");    
const templatesContainer = document.querySelector(".templates-container");

if(addTemplateButton != null){  //Jeżeli na stronie istnieje taki przycisk
    addTemplateButton.addEventListener('click',openTemplateCreation);   //to zostanie dodana metoda otwierająca okno tworzenia wzoru
}

const LOC_STORAGE_TEMPLATES_LIST = 'templatesList'; //Stałe klucze do local storage, ustawione w celu uniknięcia pomyłki
const LOC_STORAGE_SESSIONS_LIST = 'sessionsList';

currentOpenedWorkoutTemplate = new WorkoutTemplate();   //Zmienna przechowująca aktualnie otwarty wzór
editedTemplateIndex = -1;   //Indeks edytowanego wzoru (do edycji i usuwania wzorów)

if(templatesContainer != null){ //Jeżeli na stronie istnieje kontener na wzory
    generateTemplates();    //To zostaną wygenerowane na stronie
}

function generateTemplates(){   //Metoda generująca wzory na stronie
    templatesContainer.innerHTML = "";  //Wyczyść kontener
    
    let templatesList = getTemplatesList(); //Pobierz listę wzorów
    templatesList.forEach(element => {  //Dla każdego wzoru
        element = Object.assign(new WorkoutTemplate(),element); //Przypisz wzór do klasy
        element.generateWorkoutTemplate();  //Wywołaj metodę na obiekcie
    });
}

function deleteTemplate(event){ //Metoda usuwająca wzór z listy
    if(!window.confirm("Warning, this will delete all sessions based on this template!")){  //Ostrzeżenie, użytkownik może zrezygnować z działania
        return;
    }
    const templateToDeleteName = event.target.dataset.name; //Pobranie nazwy wzoru do usunięcia z atrybutu data-<wartość> dodanego w celu identyfikacji

    let newSessionsList = [];   //Nowa lista sesji po usunięciu tych opartych o usuwany wzór
    const sessionsList = getSessionsList(); //Pobierz listę wzorów
    sessionsList.forEach(session =>{    //Dla każdego wzoru
        if(session.template.name !== templateToDeleteName){ //Jeżeli nie jest stworzony z tego wzoru
            newSessionsList.push(session);  //Dodaj do zaktualizowanej listy
        }
    })
    localStorage.setItem(LOC_STORAGE_SESSIONS_LIST,JSON.stringify(newSessionsList));    //Zapisz nową listę w bazie localStorage

    const templateList = getTemplatesList();    //Pobierz wzory
    const index = templateList.indexOf(templateList.find(template => template.name === templateToDeleteName));  //Znajdź indeks wzoru w oparciu o jego nazwę (jest unikalna)
    templateList.splice(index,1);   //Usuń wzór z listy
    localStorage.setItem(LOC_STORAGE_TEMPLATES_LIST,JSON.stringify(templateList));  //Zapisz zaktualizowaną listę

    generateTemplates(); //Odśwież wzory na stronie
}

function openTemplateCreation(event){   //Metoda tworząca i otwierająca okno tworzenia/edycji wzoru

    const existingTemplateName = event.target.dataset.name; //Pobierz wartość atrybutu data-<wartość> z przycisku który wywołał tą metodę

    if(existingTemplateName != null){   //Jeżeli jakaś wartość tam jest to oznacza że metodę wywołał przycisk edycji
        new WorkoutTemplate().generateWorkoutTemplateDialog('Edit');    //Stwórz szkielet okna z odpowiednim trybem

        const templatesList = getTemplatesList();   //Pobierz listę wzorów
        let template = templatesList.find(template => template.name == existingTemplateName);   //Znajdź wzór do edycji
        currentOpenedWorkoutTemplate = Object.assign(new WorkoutTemplate(),template);   //Zamień w obiekt odpowiedniej klasy i przypisz do zmiennej
        currentOpenedWorkoutTemplate.loadDataIntoForm();    //Wywołaj metodę ładującą dane do formularza

        editedTemplateIndex = templatesList.indexOf(template);  //Zapisz index edytowanego wzoru w celu zastąpienia

        const createTemplateForm = document.querySelector(".create-template-form");     
        createTemplateForm.addEventListener('submit',onTemplateEdition);    //W momencie wysłania formularza zostanie wywołana metoda zapisująca dane z formularza i nadpisująca istniejący wzór 
    } else {    //Jeżeli nie ma wartości to metodę wywołał przycisk tworzenia nowej 
        new WorkoutTemplate().generateWorkoutTemplateDialog('Create');  //Stwórz szkielet okna z odpowiednim trybem

        const createTemplateForm = document.querySelector(".create-template-form");
        createTemplateForm.addEventListener('submit',onTemplateSubmission); //W momencie wysłania formularza zostanie wywołana metoda zapisująca dane z formularza jako nowy wzór
        
        currentOpenedWorkoutTemplate = new WorkoutTemplate();   //Stworzenie nowego pustego formularza
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