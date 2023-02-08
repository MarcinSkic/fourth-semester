/*
 * Lab6_LCD_2.c
 *
 * Created: 2022-06-15 08:06:38
 * Author : Student
 */ 

#include <util/delay.h>
#include <avr/io.h>
//#include <time.h>

//Zdefiniowanie macr dla ulatwienia pracy
#define LCD_DDR DDRB
#define LCD_PORT PORTB
#define LCD_E 1
#define LCD_RS 0

#define KEYPAD_DDR DDRD
#define KEYPAD_PORT PORTD
#define KEYPAD_PIN PIND

const int DISPLAY_WIDTH = 16;
const int DISPLAY_HEIGHT = 2;

int cursorColumn; //Pozycja kursora
int cursorRow;

int appleColumn = 7;
int appleRow = 1;
int gameState = 0;

int snakeLength = 1;
char snakePositions[32];

int getKey(){
	//Zabezpieczenie przed stykaniem / Kod bledu
	
	int x, result = 0, buttonsClicked = 0;
	for(int i = 4; i < 8; i++){
		KEYPAD_PORT = ~(1<<i);
		_delay_ms(1);
		
		x = KEYPAD_PIN & 0x0F;
		_delay_ms(5);
		
		if(x != (KEYPAD_PIN & 0x0F)) break;
		
		switch(x){
			case 0b00001111:
			break;
			case 0b00001110:
			
			buttonsClicked++;
			if(buttonsClicked >= 2) return 0xFF;
			
			KEYPAD_PORT = 0x0F;
			_delay_ms(1);
			KEYPAD_PORT |= (1<<i);
			_delay_ms(1);
			
			if((KEYPAD_PIN & 0x0F) == x) return 0xFF;
			
			result = 1+i-4;
			break;
			case 0b00001101:
			
			buttonsClicked++;
			if(buttonsClicked >= 2) return 0xFF;
			
			KEYPAD_PORT = 0x0F;
			_delay_ms(1);
			KEYPAD_PORT |= (1<<i);
			_delay_ms(1);
			if((KEYPAD_PIN & 0x0F) == x) return 0xFF;
			
			result = 5+i-4;
			break;
			case 0b00001011:
			
			buttonsClicked++;
			if(buttonsClicked >= 2) return 0xFF;
			
			KEYPAD_PORT = 0x0F;
			_delay_ms(1);
			KEYPAD_PORT |= (1<<i);
			_delay_ms(1);
			if((KEYPAD_PIN & 0x0F) == x) return 0xFF;
			
			result = 9+i-4;
			break;
			case 0b00000111:
			
			buttonsClicked++;
			if(buttonsClicked >= 2) return 0xFF;
			
			KEYPAD_PORT = 0x0F;
			_delay_ms(1);
			KEYPAD_PORT |= (1<<i);
			_delay_ms(1);
			if((KEYPAD_PIN & 0x0F) == x) return 0xFF;
			
			result = 13+i-4;
			break;
			default:
			if(x!=0b00001111) result = 0xFF;
		}
	}
	return result;
}

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
	cursorColumn = 0; //Pozycja kursora
	cursorRow = 0;
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
	
	inputLCD(0b00001100);	//Wlaczenie wyswietlacza, bez kursora i migania
	
	LCD_PORT |= 1<<LCD_RS;	//Ustawienie wyswietlacza na przyjmowanie danych do wyswietlenia
	
	clearLCD();
}

void write(char* word,int length){
	for(int i = 0; i < length;i++){
		inputLCD(word[i]);
	}
}

void positionCursor(int row, int column){	//Metoda ustawiajaca kursor na podanej pozycji
	
	instruction((row*0x40 + column) | 0b10000000);	//Ustawienie kursora poprzez sume logiczna polecenia zmiany pamieci DDRAM 0b10000000 i wartosci nowej pozycji
}

void positionByAddress(int address){
	instruction(address | 0b10000000);
}

void addSymbol(char* bitmap,char address){	//Metoda dodaj�ca nowy symbol do pami�ci CGRAM na podanym adresie
	LCD_PORT &= ~(1<<LCD_RS);	//Ustawienie wyswietlacza na przyjmowanie polecen
	
	inputLCD(0b01000000 + (address*8));	//Wyslanie polecenia dodania nowego symbolu zsumowanego z adresem na jaki chcemy go dodac
	
	LCD_PORT |= 1<<LCD_RS;	//Ustawienie wyswietlacza na przyjmowanie danych (w tym wypadku bitmapy nowego symbolu)
	
	const int SYMBOLS_HEIGHT = 8;	//W tym wypadku symbol zawsze ma 8 pikseli wysoko�ci, tyle wierszy musimy poda�
	for(int i = 0; i < SYMBOLS_HEIGHT; i++){
		inputLCD(bitmap[i]);	//Wy�lij wiersz pikseli o indeksie i
	}
	
	instruction(0b00000010);	//Ustawienie kursora na pozycji startowej, co konczy przesylanie danych do CGRAM (jedna z kilku mozliwosci)
}

void debug(char symbol){
	positionCursor(0,14);
	inputLCD(symbol);
	_delay_ms(1000);
	positionCursor(0,14);
	inputLCD(' ');
}

void moveSnake(int direction){
	switch(direction){
		case 1:
		cursorRow -= 1;
		if(cursorRow < 0){
			cursorRow = DISPLAY_HEIGHT-1;
		}
		break;
		case 2:
		cursorColumn += 1;
		if(cursorColumn >= DISPLAY_WIDTH){
			cursorColumn = 0;
		}
		break;
		case 3:
		cursorRow += 1;
		if(cursorRow >= DISPLAY_WIDTH){
			cursorRow = 0;
		}
		break;
		case 4:
		cursorColumn -= 1;
		if(cursorColumn < 0){
			cursorColumn = DISPLAY_WIDTH-1;
		}
		break;
	}

	//Wypisanie nowej g�owy
	positionCursor(cursorRow,cursorColumn);
	inputLCD(0);

	_delay_ms(50);
	
	//Sprawdzenie czy trafilismy na cialo
	for(int i = 0; i < snakeLength;i++){
		if(cursorRow*0x40+cursorColumn == snakePositions[i]){
			gameState = -1;
			return;
		}
	}

	//Sprawdzenie czy trafilismy na jablko
	if(appleColumn == cursorColumn && appleRow == cursorRow){
			snakeLength++;
			_delay_ms(50);
			//Sprawdzenie czy wygrano
			if(snakeLength >= 10){
				gameState = 1;
				return;
			}
			
			int found;
			int row;
			int col;
			
			do{
				row = rand()%2;
				col = rand()%16;
				
				found = 1;
				
				for(int i = 0; i < snakeLength;i++){
					if(row*0x40+col == snakePositions[i]){
						
						found = 0;
						break;
					}
				}
				
			} while(!found);
			
			positionCursor(row,col);
			inputLCD(1);
			appleRow = row;
			appleColumn = col;
		} else {
			//Usuniecie ogona
			positionByAddress(snakePositions[snakeLength-1]);
			inputLCD(' ');
		}
	
	
	
	//Przesuniecie pozycji w pamieci
	for(int i = snakeLength-1; i > 0; i--){
		snakePositions[i] = snakePositions[i-1];
	}

	//Dopisanie pozycji glowy
	snakePositions[0] = (cursorRow*0x40 + cursorColumn);
	positionCursor(cursorRow,cursorColumn);

}

void snake (){
	char snakePart[] = {0,0b00001110,0b00001110,0b00001110,0b00001110,0b00001110,0b00001110,0};
	char apple[] = {0,0,0,0b00001110,0b00001110,0,0,0};

	int currentDirection = 2;
	int newDirection = -1;
	snakePositions[0] = 0;

	DDRD = 0xF0;
	PORTD = 0x0F;

	initLCD();

	addSymbol(snakePart,0);

	addSymbol(apple,1);

	positionCursor(appleRow,appleColumn);
	inputLCD(1);

	while(1){
		
		moveSnake(currentDirection);
		
		for(int i = 0; i < 20;i++){
			newDirection = getKey();
			
			switch(newDirection){
				case 3:
				currentDirection = 1;
				break;
				case 6:
				currentDirection = 4;
				break;
				case 8:
				currentDirection = 2;
				break;
				case 11:
				currentDirection = 3;
				break;
			}
		}
		
		if(gameState == 1){
			clearLCD();
			positionCursor(0,0);
			write("Wygrales!",9);
			return;
		}
		
		if(gameState == -1){
			clearLCD();
			positionCursor(0,0);
			write("Przegrales!",11);
			return;
		}
	}
}

int main(void)
{
	snake();
}

