

from locale import currency
from logging import warning
import re


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
    symbols = {1000:'M',500:'D',100:'C',50:'L',10:'X',5:'V',1:'I'}

    number = int(input("Podaj liczbę: "))
    result = ""
    for i in range(len(symbols)):
        currentNumber = list(symbols)[i]
        while(number >= currentNumber):

            if(number >= currentNumber*9/5 and i%2 == 1): #
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

def NumberIntoRomanSlim():
    symbols = {1000:'M',900:'CM',500:'D',400:'CD',100:'C',90:'XC',50:'L',40:'XL',10:'X',9:'IX',5:'V',4:'IV',1:'I'}

    number = int(input("Podaj liczbę: "))
    result = ""
    for i in range(len(symbols)):
        currentNumber = list(symbols)[i]
        while(number >= currentNumber):

            result += symbols[currentNumber]
            number -= currentNumber 

    print (result)

def RomanIntoNumber():
    symbols = {'M':1000,'D':500,'C':100,'L':50,'X':10,'V':5,'I':1}
    number = input("Podaj liczbę rzymską: ")
    result = 0
    lastNumber = 1000
    for char in number:
        currentNumber = 0
        
        try:
            currentNumber = symbols[char]
        except KeyError: 
            warning("Thats not roman numeral!")
            return

        if(lastNumber < currentNumber):
            result += currentNumber-lastNumber*2
        else:
            result += currentNumber
        lastNumber = currentNumber
        
        
    print(result)

RomanIntoNumber()