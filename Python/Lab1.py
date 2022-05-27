

def FizzBuzz():
    for i in range (1,101):
        if (i%3 == 0 and i%5 == 0):
            print ("FizzBuzz")
            continue
        if (i%3 == 0):
            print ("Fizz")
            continue
        if (i%5 == 0):
            print ("Buzz")
            continue
        print(i)

def DigitsIntoWords(number):
    words = {0:"Zero",1:"Jeden",2:"Dwa",3:"Trzy",4:"Cztery",5:"Pięć",6:"Sześć",7:"Siedem",8:"Osiem",9:"Dziewięć"}
    slowo = []
    while(number > 0):
        slowo.append(words[number%10])
        number = int(number/10)
    slowo.reverse()
    print(" ".join(slowo))

def DigitsIntoWordsImproved(number):
    words = {'0':"Zero",'1':"Jeden",'2':"Dwa",'3':"Trzy",'4':"Cztery",'5':"Pięć",'6':"Sześć",'7':"Siedem",'8':"Osiem",'9':"Dziewięć"}
    slowo = str(number)
    for i in slowo:
        print(words[i],end=" ")

def NumberIntoRoman():
    number = int(input("Podaj liczbę: "))
    result = ""
    symbols = {1000:'M',500:'D',100:'C',50:'L',10:'X',5:'V',1:'I'}
    currentNumber = 1000
    currentIndex = 0

    while(number > 0):
        if(number >= currentNumber):
            result += symbols[currentNumber]
            number -= currentNumber
            print(number)
            print(result)
        else:
            currentIndex += 1
            currentNumber = list(symbols)[currentIndex]
    print(result)

def NumberIntoRomanImproved():
    symbols = {1000:'M',500:'D',100:'C',50:'L',10:'X',5:'V',1:'I'}

    number = int(input("Podaj liczbę: "))
    currentNumber = 1000
    result = ""
    for i in range(7):
        currentNumber = list(symbols)[i]
        while(number >= currentNumber):
            if(number >= currentNumber*9/5 and i%2 == 1):
                result += symbols[list(symbols)[i+1]]
                result += symbols[list(symbols)[i-1]]
                number -= currentNumber*9/5
                break

            result += symbols[currentNumber]

            if(i%2 == 0):
                if(number >= currentNumber*4):
                    result += symbols[list(symbols)[i-1]]
                    number -= currentNumber*4
                    break
            number -= currentNumber 
    print (result)

NumberIntoRomanImproved()