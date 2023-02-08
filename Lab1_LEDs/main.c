/*
 * lab1.c
 *
 * Created: 2022-04-27 08:20:51
 * Author : Student
 */ 

#include <avr/io.h>
#include <util/delay.h>

void zadanie1();
void zadanie1alternative();
void zadanie2();
void zadanie3();
void zadanie4();
void zadanie5();
void warnAboutSequenceChange();

int main(void)
{
	DDRA = 0xFF;

    while (1) 
    {
		zadanie1alternative();
		warnAboutSequenceChange();
		zadanie2();
		warnAboutSequenceChange();
		zadanie3();
		warnAboutSequenceChange();
		zadanie4();
		warnAboutSequenceChange();
		zadanie5();
		warnAboutSequenceChange();
    }
}

void zadanie1(){
	//Petla przechodzaca 6 razy
	for(uint8_t x = 7; x > 1; x--){
		PORTA ^= (1<<x)|(1<<x-1);	//Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku nadanie im stanu wysokiego (wlacz)
		_delay_ms(500);
		PORTA ^= (1<<x)|(1<<x-1);	//Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku nadanie im stanu niskiego (wylacz)
	}
	
	//Petla przechodzaca 7 razy
	for(uint8_t x = 0; x <7; x++){
		PORTA ^= (1<<x)|(1<<x+1);	//Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku nadanie im stanu wysokiego (wlacz)
		_delay_ms(1000);
		PORTA ^= (1<<x)|(1<<x+1);	//Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku nadanie im stanu niskiego (wylacz)
	}
}

void zadanie1alternative(){
	PORTA |= (1<<7); //Selektywne ustawienie startowego bitu

	for(int x = 7;x>0;x--){ //Petla przechodzaca 7 razy
		PORTA ^= (1<<x+1)|(1<<x-1);	//Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku x-1 zostanie wlaczony a x+1 wylaczony
		_delay_ms(500);
	}
	_delay_ms(500);	//Dodatkowe opoznienie zeby pierwszy krok przy "powrocie" rowniez trwal 1s
	for(int x = 1;x<7;x++){ //Petla przechodzaca 6 razy
		PORTA ^= (1<<x+1)|(1<<x-1); //Negacja 2 bitow z uzyciem sumy logicznej 2 masek bitowych. W tym wypadku x-1 zostanie wylaczony a x+1 wlaczony
		_delay_ms(1000);
	}
}

void zadanie2(){

	for(uint8_t i = 7; i > 3;i--){
		PORTA |= 1<<i;	//Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
	
	for(uint8_t i = 4; i <7;i++){
		PORTA &= ~(1<<i);	//Selektywne zerowanie z uzyciem zaprzeczenia maski bitu na pozycji opartej o indeks petli (wylaczenie)
		_delay_ms(1000);
	}
}

void zadanie3(){
	for(int i = 7; i >= 0;i--){
		PORTA |= 1<<i; //Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
}

void zadanie4(){
	for(int i = 3; i >= 0;i--){
		PORTA |= 1<<i;	//Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
	PORTA &= 0;	//Wyzerowanie bitow portu A
	for(int i = 4; i < 8;i++){
		PORTA |= 1<<i;	//Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
	PORTA &= 0; //Wyzerowanie bitow portu A
}

void zadanie5(){
	for(int i = 7; i > 3;i--){
		PORTA |= 1<<i;	//Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
	PORTA &= 0; //Wyzerowanie bitow portu A
	for(int i = 0; i < 4;i++){
		PORTA |= 1<<i;	//Selektywne ustawienie bitu na pozycji opartej o indeks petli (wlaczenie)
		_delay_ms(1000);
	}
	PORTA &= 0; //Wyzerowanie bitow portu A
}

void warnAboutSequenceChange(){
	for(int i = 0; i < 2; i++){
		PORTA &= 0;
		_delay_ms(250);
		PORTA |= 0xFF;
		_delay_ms(250);
	}
	PORTA &= 0;
}