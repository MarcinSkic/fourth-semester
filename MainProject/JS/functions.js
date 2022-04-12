function oblicz() { //Słówko var - oznacza zmienną; typ tej zmiennej
    //będzie zależał od jej wartości;
    //Pobierz element o id=l1 do zmiennej l1:
    var l1 = document.getElementById('l1');
    //pobierz wartość (łańcuch tekstowy) wpisaną w polu
    //formularza o id='l1':
    l1 = l1.value;
    //Przekonwertuj (jeśli się uda) l1 do wartości typu int:
    l1 = parseInt(l1);
    //Jeśli udała się próba konwersji to l1 zawiera wartość całkowitą
    //Analogicznie realizujemy pobranie wartości z drugiego pola
    // tekstowego, ale tym razem wszystko w jednej instrukcji:
    var l2 = parseInt(document.getElementById('l2').value);
    //Teraz już możemy obliczyć sumę i ustawić wartość pola tekstowego
    //o id='suma':
    var s = document.getElementById('suma');
    s.value = l1 + l2;
}

function calculateRate (){
    const moneyTaken = +document.querySelector('#moneyTaken').value;
    const ratesAmount = +document.querySelector('#ratesAmount').value;
    const percentage = +document.querySelector('#percentage').value;
    const monthlyRate = document.querySelector('#monthlyRate');
    const moneyToReturn = document.querySelector('#moneyToReturn');

    const rate = (moneyTaken * (percentage/100/12)) / (1-(1/Math.pow((1+(percentage/100/12)),ratesAmount)));
    
    if(isNaN(rate) || !isFinite(rate)){
        alert("Coś nie pykło");
        return;
    }

    monthlyRate.value = Math.round(rate*100)/100;
    moneyToReturn.value = Math.round(rate*ratesAmount*100)/100;
}