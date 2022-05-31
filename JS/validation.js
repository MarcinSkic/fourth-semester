
function validateField(field_id,regex) {
    let fieldElement = document.getElementById(field_id);
    return regex.test(fieldElement.value);
}
function validateRadios(radio_name) {
    const elements = document.getElementsByName(radio_name);

    return [...elements].find(radio => radio.checked) !== undefined;

}
function validateCheckboxes(containerId) {
    const checkboxes = document.querySelectorAll(`#${containerId} > input[type='checkbox']`);

    return [...checkboxes].find(checkbox => checkbox.checked);
}

function validate() { 
    let isOk = true;
    const surnameRegex = /^[a-zA-Z]{2,20}$/;
    const ageRegex= /^[1-9][0-9]{1,2}$/;
    const emailRegex = /^([a-zA-Z0-9])+([.a-zA-Z0-9_-])*@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)+/;
    

    if (!validateField("surname",surnameRegex)){ 
        isOk=false;
        document.getElementById("surname-cont").setAttribute('data-error', 'Wpisz poprawnie nazwisko!');
    } else document.getElementById("surname-cont").setAttribute('data-error', '');

    if (!validateField("age",ageRegex)){
        isOk = false;
        document.getElementById("age-cont").setAttribute('data-error', 'Wprowadz poprawny wiek!');
    } else document.getElementById("age-cont").setAttribute('data-error', '');

    if (!validateField("email",emailRegex)){
        isOk = false;
        document.getElementById("email-cont").setAttribute('data-error','Wprowadz poprawny email!');
    } else document.getElementById("email-cont").setAttribute('data-error','');

    if(!validateCheckboxes("service-cont")){
        isOk = false;
        document.getElementById("service-cont").setAttribute('data-error','Wybierz kurs!');
    } else document.getElementById("service-cont").setAttribute('data-error','');
    

    if (!validateRadios("payment")){
        isOk = false;
        document.getElementById("payment-cont").setAttribute('data-error','Podaj formę płatności!');
    } else document.getElementById("payment-cont").setAttribute('data-error','');
    
    return isOk;
}

function showData() {
    //Funkcja zbiera dane wpisane w pola formularza i wyświetla okienko
    //typu confirm do zatwierdzenia przez użytkownika:
    var dane = "Następujące dane zostaną wysłane:\n";
    dane += "Nazwisko: " + document.getElementById('surname').value + '\n';
    dane += "Wiek: " + document.getElementById('age').value + '\n';
    dane += "Państwo: " + document.getElementById('country').value + '\n';
    dane += "Email: " + document.getElementById('email').value + "\n";

    dane += "Kursy: "
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        if(checkbox.checked) dane += checkbox.value+' ';
    });
    dane += '\n';

    dane += "Sposób zapłaty: "
    let payment = [...document.getElementsByName('payment')];
    dane += payment.find(checkbox => checkbox.checked).value;
    dane += '\n';
    
    if (window.confirm(dane)) 
        return true; 
    else 
        return false;
}