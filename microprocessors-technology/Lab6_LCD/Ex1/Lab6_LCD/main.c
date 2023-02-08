/*
 * Lab6_LCD.c
 *
 * Created: 2022-06-08 08:24:16
 * Author : Student
 */
#include <util/delay.h>
#include <avr/io.h>

//Zdefiniowanie macr dla ulatwienia pracy
#define LCD_DDR DDRA
#define LCD_PORT PORTA
#define LCD_E 1
#define LCD_RS 0

char cursorPosition; //Pozycja kursora

void startup(char tryb){	//Metoda potrzebna do ustawienia wyswietlacza w tryb 4 bitowy, przekazuje tylko 4 starsze bity
	LCD_PORT |= 1<<LCD_E;	//Przekazanie informacji o rozpoczeciu transmisji
	asm volatile("nop");	//Odczekanie z uzyciem instrukcji asemblerowej
	LCD_PORT = (tryb & 0xF0) | (LCD_PORT & 0x0F);	//Przekazanie 4 starszych bitow informacji poprzez zlozenie ich z niezmienionymi 4 mlodszymi bitami reprezentujacymi bity specjalne wyswietlacza (w tym wypadku tylko 2 bity RS i E)
	asm volatile("nop");
	LCD_PORT &= ~(1<<LCD_E);	//Przekazanie informacji o zakonczeniu transmisji
	asm volatile("nop");
}

void inputLCD(char data){
	//Identycznie jak w metodzie powyzej
	LCD_PORT |= 1<<LCD_E;
	asm volatile("nop");
	LCD_PORT = (data & 0xF0) | (LCD_PORT & 0x0F);
	asm volatile("nop");
	LCD_PORT &= ~(1<<LCD_E);
	asm volatile("nop");
	
	LCD_PORT |= 1<<LCD_E;
	asm volatile("nop");
	LCD_PORT = ((data & 0x0F)<<4) | (LCD_PORT & 0x0F);	//Przekazanie 4 mlodszych bitow informacji poprzez przesuniecie bitowe w lewo i zlozenie z bitami wyswietlacza
	asm volatile("nop");
	LCD_PORT &= ~(1<<LCD_E);
	
	_delay_ms(1);
}

void instruction(char command){	//Metoda przekazujaca do wyswietlacza polecenia przez zmiane wartosci bitu RS
	LCD_PORT &= ~(1<<LCD_RS);	//Selektywne wylaczenie bitu RS, wyswietlacz oczekuje polecenia
	
	inputLCD(command);	//Standardowe wprowadzenie danych
	
	LCD_PORT |= 1<<LCD_RS;	//Selektywne wlaczenie bitu RS, wyswietlacz oczekuje danych do wypisania (przyjmujemy jako domyslny stan w tym programie)
}

void clearLCD(){	//Metoda czyszczaca wyswietlacz
	instruction(0x01);	//Przekazanie instrukcji wyczyszczenia wyswietlacza polaczona z ustawieniem kursora na pozycje startowa
	cursorPosition = 0;	//Odpowiednie ustawienie zmiennej reprezentujacej pozycje kursora
	_delay_ms(60);	//Czyszczenie potrafi zajmowac wiecej czasu, dlatego dluzsze opoznienie
}

void initLCD()
{
	LCD_DDR = 0xFF;	//Ustawienie portu na wyjscie
	LCD_PORT = 0;	//Wyzerowanie
	
	LCD_PORT &= ~(1<<LCD_RS);	//Ustawienie wyswietlacza na przyjmowanie polecen
	
	//Kilkukrotne wlaczenie trybu 8 bitowego z dluzszym czekaniem na wyswietlacz
	startup(0b00110000);
	_delay_ms(5);
	startup(0b00110000);
	_delay_ms(100);
	startup(0b00110000);	
	_delay_ms(100);
	startup(0b00100000);	//Wlaczenie trybu 4 bitowego
	
	inputLCD(0b00101000);	//Doprecyzowanie trybu 4 bitowego
	
	inputLCD(0b00000110);	//Ustawienie przesuwanie kursora w prawo
	
	inputLCD(0b00001111);	//Wlaczenie wyswietlacza, kursora i migania
	
	LCD_PORT |= 1<<LCD_RS;	//Ustawienie wyswietlacza na przyjmowanie danych do wyswietlenia
	
	clearLCD();
}

void positionCursor(int row, int column){	//Metoda ustawiajaca kursor na podanej pozycji
	cursorPosition = row*0x40 + column;	//Wyliczanie pozycji na podstawie wartosci w pamieci DDRAM, drugi wiersz zaczyna sie od wartosci 0x40
	instruction(cursorPosition | 0b10000000);	//Ustawienie kursora poprzez sume logiczna polecenia zmiany pamieci DDRAM 0b10000000 i wartosci nowej pozycji
}

void write(char *word, int length){	//Metoda zapisujaca ciag znakow na wyswietlacz
	for (int i =0; i < length;i++)
	{
		inputLCD(word[i]);	//Wypisz kolejny charakter ASCII z ciagu
		cursorPosition++;	//Kursor przemieszcza sie wraz z kazdym wpisanym znakiem
	}
}

void clearRowFromPosition(int column){	//Metoda czyszczaca wartosci z wiersza w ktorym jest kursor od kolumny podanej jako argument
	int endPoint;	//Zmienna przechowujaca koniec widocznej czesci wyswietlacza w danym wierszu
	if(cursorPosition >= 0x40){	//Jezeli wartosc pamieci kursora jest wieksza od tej wartosci to jest on w drugim wierszu
		positionCursor(1,column);	//Ustaw kursor na podanej pozycji
		endPoint = 0x40 + 16;	//Ustaw koniec czyszczenia
	} else {
		endPoint = 16;	//Ustaw koniec czyszczenia
		positionCursor(0,column);	//Ustaw kursor na podanej pozycji
	}
	
	for (int i = cursorPosition; i<endPoint ;i++)	//Dopoki kursor nie dotarl do konca wyswietlacza...
	{
		inputLCD(' ');	//... wstawiaj spacje czyli "czysc"
		cursorPosition++;	//Kursor sie przemieszcza
	}
}

void task1(){	//Wywolanie metod do zaprezentowania ich dzialania
	
	initLCD();
	
	_delay_ms(1000);
	
	write("Wyswietlacz Wita",16);
	
	positionCursor(1,5);
	
	_delay_ms(500);
	
	write("Usun: MNIE",10);
	
	_delay_ms(2000);
	
	clearRowFromPosition(10);
}

int main(void)
{
	task1();
}

