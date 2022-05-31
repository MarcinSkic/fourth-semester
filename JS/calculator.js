const numX = document.querySelector('#x');
const numY = document.querySelector('#y');
const result = document.querySelector('#result');
const operations = document.querySelectorAll('input[name="operation"]');

operations.forEach(radio => radio.addEventListener('change',operationPick))

function operationPick(event){
    if(event.target.checked){
        calculate(event.target.value);
    }
}

function calculate(operator){
    let x = +numX.value;
    let y = +numY.value;
    let number;

    if(isNaN(x) || isNaN(y)){
        result.value = 'To nie są liczby!';
        return;
    }

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