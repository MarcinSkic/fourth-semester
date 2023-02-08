#include <avr/io.h> //biblioteka zawierająca definicje i rejestry procesora
#include <util/delay.h> //biblioteka pozwalająca na używanie funkcji opóźnienia

#define LCD_DDR DDRB
#define LCD_PORT PORTB
#define LCD_RS 0
#define LCD_E 1

void olderBytesInputLCD(char data){	//4 bity na dane + 4 
	LCD_PORT |= 1 << LCD_E;
	asm volatile("nop");
	LCD_PORT = (data & 0xF0) | (LCD_PORT & 0x0F);
	asm volatile("nop");
	LCD_PORT &= ~(1 << LCD_E);
}

void inputLCD(char data){

	LCD_PORT |= 1 << LCD_E;
	asm volatile("nop");
	LCD_PORT = (data & 0xF0) | (LCD_PORT & 0x0F);
	asm volatile("nop");
	LCD_PORT &= ~(1 << LCD_E);

	asm volatile("nop");

	LCD_PORT |= 1 << LCD_E;
	asm volatile("nop");
	LCD_PORT = ((data & 0x0F) << 4) | (LCD_PORT & 0x0F);
	asm volatile("nop");
	LCD_PORT &= ~(1<<LCD_E);

	_delay_ms(1);
}

void clearLCD(){
	
	LCD_PORT &= ~(1<<LCD_RS);

	inputLCD(0x01);

	LCD_PORT |= 1<<LCD_RS;

	_delay_ms(60);
}

void initLCD(){
	LCD_DDR = 0xF0 | 1<<LCD_RS | 1<<LCD_E;
	LCD_PORT = 0;

	LCD_PORT &= ~(1<<LCD_RS);

	olderBytesInputLCD(0b00110000);
	_delay_ms(5);
	olderBytesInputLCD(0b00110000);
	_delay_ms(100);
	olderBytesInputLCD(0b00110000);
	_delay_ms(100);
	olderBytesInputLCD(0b00100000);

	inputLCD(0b00101000);	//Ustawienie trybu danych interfejsu (4 bity)


	inputLCD(0b00000110);	//Sposób przesuwania okna


	inputLCD(0b00001111);	//Włączenie wyświetlacza
	LCD_PORT |= 1<<LCD_RS;

	clearLCD();
}

void positionCursorLCD(int x,int y){
	LCD_PORT &= ~(1<<LCD_RS);
	inputLCD((x*0x40+y)|0b10000000);
	LCD_PORT |= 1<<LCD_RS;
}

void writeWord(char *word,int length){
	for(int i = 0; i < length; i++){
		inputLCD(word[i]);
	}
}

void LCD_task2(){
	initLCD();
	
	DDRD = 0xF0;
	PORTD = 0x0F;

	int currentNumber;
	while(1){
		currentNumber = getKey();
		if(currentNumber > 0 && currentNumber <= 16){
			clearLCD();

			writeWord("Skic M.",7);
			positionCursorLCD(1,0);
			writeWord("Przycisk nr:",12);

			if(currentNumber >= 10){
				inputLCD((currentNumber/10)%10+48);
				inputLCD(currentNumber%10+48);
			} else {
				inputLCD(48);
				inputLCD(currentNumber+48);
			}
		}
	}
}


int main(void)
{
	LCD_task2();
}