function pokaz(id) {
    var tresc = "";
    switch (id) {
        case 2: tresc += pokazGalerie();
            break;
        case 3: tresc += pokazPost();
            break;
        case 4: tresc += pokazKontakt();
            break;
        default: tresc += pokazO();
    }
    //pobierz element o wskazanym id i ustaw jego nową zawartość:
    document.getElementById('blok').innerHTML = tresc;
}
function pokazO() {
    var tresc = '<h2><br />Pierwsze kroki</h2> ';
    //operator += uzupełnia łańcuch kolejną porcją znaków:
    tresc += '<p>W aplikacjach typu SPA ......</p>' +
        '<p class="srodek"><img src="../img/gallery/full/baner.jpg" alt="Zdjęcie" /></p>' +
        '<article><h2>Wady SPA</h2><p>' +
        'Czas wytworzenia oraz nakład pracy... </p></article>';
    //przekaż wynik –gotową zawartość –do miejsca wywołania funkcji:
    return tresc;
}
function pokazGalerie() {
    var tresc = '<h2><br />Moja galeria</h2>';
    tresc += ' <div class="galeria">';
    //wygeneruj kod HTML z obrazami za pomocą pętli for:
    for (i = 1; i <= 10; i++) {
        tresc += `<div class="slajd"> <img src="../img/gallery/mini/obraz${i}.JPG"></div>`;
    }
    return tresc + '</div>';
}
function pokazKontakt() {
    var tresc = '<h2><br />Kontakt</h2>';
    //uzupełnij treść:
    tresc+='<div class="middle"><p>Marcin Skic</p>'+
    '<p>ul. Przykładowa 4 </p>'+
    '<p>mail@mail.org</p>'+
    '<p>tel. 124823591</p></div>'
    return tresc;
}
function pokazPost() {
    //funkcja generuje kod formularza –dane wpisane w odpowiednie pola przez 
    //użytkownika zostaną przekazane mailem na wskazany adres, ale najpierw po 
    //zajściu zdarzenia submit (wyślij) –zostanie wywołana funkcja pokazDane()
    tresc = '<h2><br />Dodaj post</h2>';
    tresc += '<article class="srodek" ><form action="mailto:b.panczyk@pollub.pl" method="post" onsubmit="return pokazDane();">' +
        '<label for="email">Twój email:</label><br /> <input type="email" name="email"id="email"required /><br />' +
        '<label for="fullname">Nazwisko i imię:</label><br /> <input type="text" name="fullname" id="fullname" required /><br />'+
        '<label for="tel">Telefon</label> <br/> <input type="tel" name="tel" id="tel" required /> <br />'+
        'Zainteresowania: <div class="interests">'+
            '<input type="checkbox" name="sport" id="sport"><label for="sport">Sport</label>'+
            '<input type="checkbox" name="music" id="music"><label for="music">Muzyka</label>'+
            '<input type="checkbox" name="movie" id="movie"><label for="movie">Film</label>'+
            '<input type="checkbox" name="other" id="other"><label for="other">Inne</label>'+
            ' <div/>'+
        'Wiek: <br/>'+
            '<input type="radio" name="age" value="<10" id="<10"><label for="<10">Mniej niż 10</label>'+
            '<input type="radio" name="age" value="10to20" id="10to20"><label for="10to20">10-20</label>'+
            '<input type="radio" name="age" value="21to30" id="21to30"><label for="21to30">21-30</label>'+
            '<input type="radio" name="age" value="31to40" id="31to40"><label for="31to40">31-40</label>'+
            '<input type="radio" name="age" value="41to50" id="41to50"><label for="41to50">41-50</label>'+
            '<input type="radio" name="age" value=">50" id=">50"><label for=">50">Więcej niż 50</label>'+
            '<br />'+
        '<label for="wiadomosc">Komentarz:</label> <br /><textarea rows="3" cols="20" id="wiadomosc"name="wiadomosc" required></textarea>' +
        '<br /> <input type="submit" name="wyslij" value="Wyślij" />' +
        '</form></article>';
    return tresc;
}

function pokazDane() {
    //Funkcja zbiera dane wpisane w pola formularza i wyświetla okienko
    //typu confirm do zatwierdzenia przez użytkownika:
    var dane = "Następujące dane zostaną wysłane:\n";
    dane += "Email: " + document.getElementById('email').value + "\n";
    dane += "Nazwisko i imię: " + document.getElementById('fullname').value + '\n';
    dane += "Telefon: " + document.getElementById('tel').value + '\n';

    dane += "Zainteresowania: ";
    let interests = [...document.querySelectorAll('input[type="checkbox"]')];
    dane += interests.reduce((data,checkbox) => (checkbox.checked ? data += checkbox.name+" " : data),"");
    dane += '\n';

    dane += "Wiek: "
    age = [...document.getElementsByName('age')];
    dane += age.find(checkbox => checkbox.checked).value;
    dane += '\n';

    dane += "Komentarz: " + document.getElementById('wiadomosc').value + '\n';
    if (window.confirm(dane)) 
        return true; 
    else 
        return false;
}

