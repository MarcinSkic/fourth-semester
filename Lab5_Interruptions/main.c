/*
 * Lab5_Interruptions.c
 *
 * Created: 2022-06-01 08:28:09
 * Author : Student
 */ 

#include <avr/io.h>
#include <avr/interrupt.h>

ISR(INT0_vect){	//Funkcja wywolywana przy przerwaniu przez wejscie INT0
	PORTD ^= 1<< 0;
}

ISR(INT2_vect){	//Funkcja wywolywana przy przerwaniu przez wejscie INT2
	PORTD ^= 1<<1;
}


//TASK2

ISR(TIMER0_COMP_vect){	//Funkcja wywolywana przy przerwaniu przez zapalenie flagi porownania timera 0
	cli();	//Wylaczenie systemu przerwan (clear interrupt)
	
	for(int i = 0; i<9;i++){	//Petla czekajaca 9 cykli timera ctc lacznie z pierwszym czekaniem przed przerwaniem to sekunda
		while(!(TIFR & (1<<OCF0)));	//Czekanie na zapalenie flagi porownania
		TIFR |= 1<<OCF0;	//Zgaszenie flagi
	}
	
	PORTD ^= 1<<0;
	sei();	//Wlaczenie systemu przerwan (set interrupt)
}

volatile char temp; //Zmienna globalna przechowywana w pamieci, nie w rejestrze

//TASK3
ISR(TIMER0_COMP_vect){	//Funkcja wywolywana przy przerwaniu przez zapalenie flagi porownania timera 0
	temp = ~PINA; //Zapisanie stanu wcisnietych przyciskow do zmiennej
}

void task1(){

	DDRD = 0xFF;	
	PORTD |= 1<<2;
	PORTB |= 1<<2;
	
	//Ustawienie zglaszania przerwania narastajacym zboczem dla INT0
	MCUCR |= (1<< ISC00);	
	MCUCR |= (1<<ISC01);

	//Ustawienie zglaszania przerwania narastajacym zboczem dla INT2
	MCUCSR |= (1<<ISC2);
	
	GICR = 1<< INT0 | 1<< INT2;	//Wlaczenie przerwan
	GIFR = 1<< INT0 | 1<<INT2;	//Zgaszenie flag przerwan (dla pewnosci)
	
	PORTD = 0;
	
	sei();	//Wlaczenie systemu przerwan
	while (1);
}

void task2(){
	TCCR0 = 1<<CS00 | 1<<CS02 | 1<<WGM01;	//Wlaczenie timera, prescaler 1024, tryb CTC
	TIMSK = 1<<OCIE0;	//Wlaczenie przerwan od flagi porownania
	OCR0 = 98;	//Ustawienie liczby przy ktorej nastepuje porownanie (w polaczeniu z tym prescalerem cykl to okolo 100ms)
	
	//Ustawienie diod
	DDRD = 0xFF;	
	PORTD = 0;
	
	sei();	//Wlaczenie systemu przerwan
	while(1);
}

void task3(){
	TCCR0 = 1<<CS00 | 1<<CS02 | 1<<WGM01;	//Wlaczenie timera, prescaler 1024, tryb CTC
	TIMSK = 1<<OCIE0;	//Wlaczenie przerwan od flagi porownania
	OCR0 = 49;	//Ustawienie liczby przy ktorej nastepuje porownanie (w polaczeniu z tym prescalerem cykl to okolo 50ms)
	
	//Ustawienie diod
	DDRD = 0xFF;	
	PORTD = 0;
	
	//Konfiguracja klawiatury
	DDRA = 0;
	PORTA = 0x0F;
	
	sei();	//Wlaczenie systemu przerwan
	while(1) {
		PORTD = temp;	//Wyswietlanie ostatniego odczytu stanu przycisków na diodach
	}
}

int main(void)
{
    task2();
}

