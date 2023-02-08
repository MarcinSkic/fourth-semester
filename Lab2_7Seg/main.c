/*
 * Lab2_7Seg.c
 *
 * Created: 2022-05-04 08:12:21
 * Author : Student
 */ 

#include <time.h>
#include <avr/io.h>
#include <util/delay.h>

void task1(unsigned char cyfry[],int durationInSecond){	//Funkcja wyswietlajaca rok urodzenia przez podana liczbe sekund
	for(int i = 0; i < 125*durationInSecond; i++){	//Petla wykonujaca 125 obrotow poniewaz po jednym obrocie petli mijaja 8ms wiec po wszystkich przejsciach mija dokladnie sekunda. Dodatkowo wymnozona przez argument funkcji wiec mozna sterowac czasem wyswietlania tej liczby
		PORTB = ~(1<<0);	//Ustawienie najmlodszego bitu portu B na 0 czyli na wyswietlanie (kolumna jednosci)
		PORTA = ~cyfry[1];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra 1
		_delay_ms(2); //Opoznienie niezbedne do stabilnego dzialania wyswietlacza
		
		PORTB = ~(1<<1);	//Ustawienie 1 bitu portu B na 0 czyli na wyswietlanie (kolumna dziesiatek)
		PORTA = ~cyfry[0];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra 0
		_delay_ms(2); //Opoznienie niezbedne do stabilnego dzialania wyswietlacza
		
		PORTB = ~(1<<2);	//Ustawienie 2 bitu portu B na 0 czyli na wyswietlanie (kolumna setek)
		PORTA = ~cyfry[0];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra 0
		_delay_ms(2); //Opoznienie niezbedne do stabilnego dzialania wyswietlacza
		
		PORTB = ~(1<<3);	//Ustawienie 3 bitu portu B na 0 czyli na wyswietlanie (kolumna tysiecy)
		PORTA = ~cyfry[2];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra 2
		_delay_ms(2); //Opoznienie niezbedne do stabilnego dzialania wyswietlacza
	}
}

void task2(unsigned char cyfry[]){
	int currentNumber = 2;	//Startowa liczba do wyswietlenia
	while(currentNumber <= 142){	//Wyswietlanie ma sie odbywac dopoki nie dotrzemy do liczby 142
		for(int i = 0; i < 100; i++){	//Petla wyswietlania pojedynczej liczby, 100 obrotow bo opoznienie wewnatrz petli lacznie trwa 5ms czyli wszystkie przejscia petli to 0.5s (zgodnie z trescia zadania)
			
			PORTB = ~(1<<0);	//Ustawienie najmlodszego bitu portu B na 0 czyli na wyswietlanie (kolumna jednosci)
			PORTA = ~cyfry[currentNumber%10];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra jednosci liczby ktora chcemy wyswietlac. Cyfra jednosci jest wyliczana z uzyciem dzialania modulo
			_delay_ms(2);	//Opoznienie niezbedne do stabilnego dzialania wyswietlacza
			
			if(currentNumber >= 10){	//Sprawdzenie czy potrzebujemy wyswieltac cyfre dziesiatek
				PORTB = ~(1<<1);	//Ustawienie 1 bitu portu B na 0 czyli na wyswietlanie (kolumna dziesiatek)
				PORTA = ~cyfry[(currentNumber/10)%10];	//Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra dziesiatek liczby ktora chcemy wyswietlac. Cyfra dziesiate jest wyliczana z uzyciem dzialania modulo po podzieleniu liczby przez 10
				
			}
			_delay_ms(2); //Opoznienie niekoniecznie niezbedne do stabilnego dzialania wyswietlacza ale niezbedne zeby kazda liczba wyswietlala sie 0.5s
			
			if(currentNumber >= 100){ //Sprawdzenie czy potrzebujemy wyswieltac cyfre setek
				PORTB = ~(1<<2);	//Ustawienie 2 bitu portu B na 0 czyli na wyswietlanie (kolumna setek)
				PORTA = ~cyfry[(currentNumber/100)%10]; //Ustawienie ze aktualnie aktywnym symbolem na wyswietlaczu jest cyfra setek liczby ktora chcemy wyswietlac. Cyfra setek jest wyliczana z uzyciem dzialania modulo po podzieleniu liczby przez 100
				
			}
			_delay_ms(1); //Opoznienie niekoniecznie niezbedne do stabilnego dzialania wyswietlacza ale niezbedne zeby kazda liczba wyswietlala sie 0.5s

		}
		currentNumber+=7;	//Powiekszenie liczby zgodnie z trescia zadania
	}
}

void task3(){
	unsigned char symbols[4] = {0b11000110,0b00111010,0b11011010,0b10011110};	//Tablica symboli ktore mamy losowac do wyswietlenia

	PORTB = ~(1<<rand()%4);	//funkcja rand losujaca przypadkowa pozycje bitu od 0 do 3 i ustawiajaca ja jako aktywna kolumne na wyswietlaczu
	PORTA = ~symbols[rand()%4];	//funkcja rand losujaca przypadkowy symbol z tablicy i ustawiajaca go na porcie A
	_delay_ms(500); //dluzsze opoznienie bo wyswietlamy tylko jedna kolumne a nie wiecej na raz
}

unsigned char getCharacter(int i, int n, unsigned char characters[]){
	if(i < 0 || i >= n) {
		return 0b00000000;	
	} else {
		return characters[i];
	}
}

void loading(unsigned char loadingSymbol[],int n){	//Funkcja ktora wyswietla zadany napis jako animacja wjezdzania i wyjezdzania tego napisu
	int currentCharacter = -4;	//Startowa pozycja wyswietlania, ujemna po to zeby wyswietlany napis "wjechal" na wyswietlacz
	
	for(int x = 0; x < 12; x++){	//Petla wykonujaca tyle obrotow ile "skokow" ma zrobic wyswietlany napis
		for(int i = 0;i<60;i++){	//Petla wyswietlania pojedynczej klatki animacji napisu , 60 obrotow razy 8 ms opoznienia = czas trwania jednej klatki
			PORTB = ~(1<<3);	//
			PORTA = ~getCharacter(currentCharacter,n,loadingSymbol);
			_delay_ms(2);
			
			PORTB = ~(1<<2);
			PORTA = ~getCharacter(currentCharacter+1,n,loadingSymbol);
			_delay_ms(2);
			
			PORTB = ~(1<<1);
			PORTA = ~getCharacter(currentCharacter+2,n,loadingSymbol);
			_delay_ms(2);
			
			PORTB = ~(1<<0);
			PORTA = ~getCharacter(currentCharacter+3,n,loadingSymbol);
			_delay_ms(2);
		}
		currentCharacter++;
	}
}

int main(void)
{
	DDRA = 0xFF;	//Aktywacja wszystkich bitow portu A jako bitow wyjscia (do wyswietlania segmentow wyswietlacza)
	DDRB = 0x0F;	//Aktywacja 4 pierwszych (mlodszych) bitow portu B jako wyjscia do wyswietlania symboli na odpowiednich kolumnach
	
	unsigned char cyfry[10] = {0b11111100,0b01100000,0b11011010,0b11110010,0b01100110,0b10110110,0b10111110,0b11100000,0b11111110,0b11110110};	//tablica zadeklarowanych cyfr do wyswietlania na wyswietlaczu
	
	unsigned char loadingSymbol[7] = {0b00011100,0b11111100,0b11101110,0b11111100,0b01100000,0b00101010,0b11011110};	//tablica zadeklarowanych znakow ktore wyswietlane po kolei tworza napis "loading"
	int n = 7; //Ilosc znakow z ktorych sklada sie wyswietlany napis "loading"
	
	srand(time(NULL));
    /* Replace with your application code */
    while (1) 
    {
		//symbolFun(cyfry,2);
		//task1(cyfry,5);
		//task2(cyfry);
		loading(loadingSymbol,n);
		//task3();
		
    }
}