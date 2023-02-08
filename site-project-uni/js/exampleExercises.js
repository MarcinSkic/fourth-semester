const options = {   //Ustawienia na jakich ma być pobierane API
	method: 'GET',  //Tryb
	headers: {
		'X-RapidAPI-Key': '',   //Klucz
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'  //Adres
	}
};

fetch('https://exercisedb.p.rapidapi.com/exercises', options)   //Pobranie danych
        .then(response => response.json())  //Przekonwertuj je do jsona
        .then(response => generateExercises(response))  //Wywołaj metodę która ich użyje
        .catch(err => console.error(err));  //W razie błędu wyświetlenie błedu w konsoli

const main = document.querySelector('main');    //Znajdź element main

async function generateExercises(response){ //Metoda generująca dla każdego ćwiczenia z API animację GIF z ćwiczeniem i jego nazwę
    response.forEach((element) => { //Dla każdego ćwiczenia
        const container = document.createElement('div');    //Stwórz kontener
    
        const img = document.createElement('img');  //Stwórz obraz
        img.setAttribute('src',element.gifUrl);     //Co ma wyświetlać
        img.setAttribute('alt',element.name);   //Jak ma się nazywać w razie nie załadowania
    
        const name = document.createElement('div'); //Nazwa ćwiczenia
        name.textContent = element.name;
    
        container.append(img,name); //Dodaj stworzone lementy do kontenera
        main.append(container); //Dodaj kontener na stronę
       
    });
}