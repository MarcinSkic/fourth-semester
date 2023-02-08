/*
 * Lab3_Timers.c
 *
 * Created: 2022-05-11 08:29:57
 * Author : Student
 */ 
#define F_CPU 1000000UL

#include <avr/io.h>
#include <util/delay.h>

void timer10ms(){	
	while(!(TIFR & 1<<OCF0));	//Petla czekajaca dopoki flaga zrownania nie zostanie aktywowana
	TIFR |= 1<<OCF0;	//Zresetowanie falgi zrownania
}

void czas_1s(){
	for(int i = 0; i < 100; i++){	//100 krotne wywolanie metody czekajacej 10ms czyli 1 sekunda
		timer10ms();
	}
}

void task1(){
	TCCR0 |= (1 << WGM01) | (1 << CS02);	//Ustawienie sterowania timera, tryb CTC i prescaler 256
	OCR0 = 39;	//Ustawienie rejestru zrownania tak zeby w polaczeniu z ustawieniem prescalera flaga zrownania byla aktywowana co mniej wiecej 10ms
	
	while(1){	//Nieskonczona petla
		czas_1s();	//wywolanie metody
		PORTA ^= _BV(0);	//negacja najmlodszego bitu
	}
}

void task2(){
	DDRB=0x0F;	//Ustawienie 4 najmlodszych bitow jako wyjscie
	PORTB = 0x01;	//Ustawienie najmlodszego bitu na stan 1
	
	TCCR0 |= 1<<CS02 | 1<<CS01;	//Ustawienie sterowania timera, tryb normalny, przyjmowanie zewnetrznego sygnalu T0 zbocze opadajace
	TCNT0 = 200;	//Ustawienie wartosci rejestru licznika na 200 do ulatwienia testow
	while(1){
		_delay_ms(200);	//systemowe opoznienie
		PORTA = TCNT0;	//Nadanie wartosci rejestru licznika portowi A (czyli diodom w stworzonym ukladzie)
		if(TIFR & 1<<TOV0){	//Sprawdzenie stanu flagi przepelnienia
			PORTA = 0;	//Jesli flaga przepelniona to zgas diody
			break;	//I wyjdz z petli konczac program
		}
	}
}

void task3(){
	TCCR0 |= 1<<WGM01 | 1<<CS02 | 1<<CS00;	//Ustawienie sterowania timera, tryb CTC, prescaler 1024
	
	
	while(1){	//Nieskonczona petla
		OCR0 = 146;	//Ustawienie rejestru zrownania na 75 % wypelnienia
		PORTA = 0xFF;	//Zapalenie diod
		while(!(TIFR & 1<<OCF0));	//Petla czekajaca na aktywacje flagi zrownania
		TIFR |= 1<<OCF0;	//Zgaszenie flagi zrownania
		OCR0 = 49;	//Ustawienie rejestru zrownania na 25 % wypelnienia
		PORTA = 0x00;	//Zgaszenie diod
		while(!(TIFR & 1<<OCF0));	//Petla czekajaca na aktywacje flagi zrownania
		TIFR |= 1<<OCF0;	//Zgaszenie flagi zrownania
	}
	
}

int main(void)
{
	DDRA = 0xFF;	//Ustawienie portu A jako wyjsciowego (diody)
	//task1();
	task2();
	//task3();
}

