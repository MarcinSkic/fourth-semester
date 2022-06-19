/*const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f7718aba17msh988a6d5c697e3a6p12ffa7jsn88d6576b411c',
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
	}
};
fetch('https://exercisedb.p.rapidapi.com/exercises', options)
        .then(response => response.json())
        .then(response => generateExercises(response))
        .catch(err => console.error(err));*/
const main = document.querySelector('main');

async function generateExercises(response){
    response.forEach((element) => {
        const container = document.createElement('div');
    
        const img = document.createElement('img');
        img.setAttribute('src',element.gifUrl);
        img.setAttribute('alt',element.name);
    
        const name = document.createElement('div');
        name.textContent = element.name;
    
        container.append(img,name);
        main.append(container);
       
    });
}