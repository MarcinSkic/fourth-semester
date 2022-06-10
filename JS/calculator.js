const numX = document.querySelector('#x');
const numY = document.querySelector('#y');
const result = document.querySelector('#result');
const operations = document.querySelectorAll('input[type="radio"]');
console.log(operations);

function operationPick(event){
    console.log("huh2");
    if(event.target.checked){
        calculate(event.target.value);
    }
}

operations.forEach(radio => {
    console.log(radio);
    radio.addEventListener('change',()=> console.log("HEJ"));
});

function calculate(operator){
    let x = +numX.value;
    let y = +numY.value;
    let number;

    if(isNaN(x) || isNaN(y)){
        result.value = 'To nie są liczby!';
        return;
    }

    console.log("Huh?");

    switch(operator){
        case '+':
            number = x + y;
            break;
        case '-':
            number = x - y;
            break;
        case '*':
            number = x*y;
            break;
        case '/':
            number = x/y;
            break;
        
        default:
            alert('ups');
            break;
    }

    result.value = number;

}
