def Palindrom():
    palin = input("Podaj palindrom: ").lower().replace(" ","").replace(',','')
    rotated = ""
    for i in range(-1,-len(palin)-1,-1):
        rotated+=palin[i]

    print(palin == rotated)

#Palindrom()

import string
import random

def CezarConstruction():
    lista = map(lambda x: x+1,[5,3])
    
    listek = [21,2,3]
    listus = map(lambda x: x + "d", "aDa")
    print(list(listus))
    print("ada".index("d"))
    for i in "AdD":
        if(i == i.upper()):
            print(i)

def OldCezar():
    kod = input("Podaj do zaszyfrowania (UWAGA tylko duże litery łacińskie): ")
    print(''.join([string.ascii_uppercase[string.ascii_uppercase.index(x)+3] for x in kod if x in string.ascii_uppercase]))

def Cezar(kod):
    print(''.join(list(map(lambda letter: (string.ascii_uppercase[string.ascii_uppercase.index(letter)-len(string.ascii_uppercase)+3] if string.ascii_uppercase.index(letter)+3 >= len(string.ascii_uppercase) else string.ascii_uppercase[string.ascii_uppercase.index(letter)+3]) if letter in string.ascii_uppercase else letter ,kod))))
    

Cezar(string.ascii_uppercase)
Cezar("PYTHON jest FAJNY")


def CarNumber():
    result = "LU "
    for i in range(3):
        result += random.choice(string.digits)
    for i in range(2):
        result += random.choice(string.ascii_uppercase)
    print(result)

#CarNumber()