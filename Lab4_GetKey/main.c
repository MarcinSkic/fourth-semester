/*
 * Lab4_GetKeyKeypad.c
 *
 * Created: 2022-05-18 08:10:51
 * Author : Student
 */ 


#include <avr/io.h>
#include <util/delay.h>


void TestColumn(int col){	//Metoda do sprawdzenia czy dana kolumna dziala
	PORTD = ~(1<<(col+4));
	_delay_ms(1);
	
	int x;
	x = PIND & 0x0F;
	
	switch(x){
		case 0b00001111:
		PORTA = 0;
		break;
		case 0b00001110:
		PORTA = 1;
		break;
		case 0b00001101:
		PORTA = 2;
		break;
		case 0b00001011:
		PORTA = 4;
		break;
		case 0b00000111:
		PORTA = 8;
		break;
	}
}

int getKey(){	//Metoda sluzaca do odczytywania wartosci wcisnietego klawisza na klawiaturze
	
	int x, result = 0, buttonsClicked = 0;	//x - bitowa wartosc wcisniecia odczytywana z PIND, result - zwracana wartosc wcisniecia czyli wartosc klawisza, 0 lub kod bledu (FF), buttonsClicked - zmienna zliczajaca wcisniecia w trakcie jednego przejscia petli sluzaca do wykrycia wielokrotnego wcisniecia "po przekatnej"
	for(int i = 4; i < 8; i++){	//Petla przechodzaca 4 razy do nadawania stanu "krazacego zera"
		PORTD = ~(1<<i);	//Ustawienie portu w taki sposob ze rejestrujemy wcisniecia klawiszy tylko w jednej kolumnie
		_delay_ms(1);
		
		x = PIND & 0x0F;	//Wymnozenie logiczne wartosci rejestru PIND w taki sposob ze usuwamy wartosci kolumn ktore nas nie interesuja (zerujemy je) i zostaja nam tylko bity wskazujace na wiersze
		_delay_ms(5);
		
		if(x != (PIND & 0x0F)) break;	//Sprawdzenie po opoznieniu czy wartosc jest nadal taka sama zeby usunac przypodkowe zwarcia na stykach
		
		switch(x){
			case 0b00001111:	//Zaden wiersz nie jest aktywny czyli nic nie jest wcisniete, pozostaje wartosc domyslna czyli 0 wiec pomijamy
				break;
			case 0b00001110:	//Wcisniety guzik na pierwszym wierszu
			
				buttonsClicked++;	//Zwiekszenie zmiennej wskazujacej na klikniecia
				if(buttonsClicked >= 2) return 0xFF;	//Jezeli jest wcisniety rowniez inny guzik to wyslij kod bledu

				result = 1+i-4;	//Zwracana wartosc to wartosc wiersza (4n+1, n >= 0) dodac wartosc kolumny (0,1,2,3)
				break;	//Opuszczenie tego przypadku wewnatrz switcha, powrot do petli
			case 0b00001101:
			
				//#Tak jak w przypadku powyzej
				buttonsClicked++;
				if(buttonsClicked >= 2) return 0xFF;
				
				result = 5+i-4;
				break;
			case 0b00001011:
			
				//#Tak jak w przypadku powyzej
				buttonsClicked++;
				if(buttonsClicked >= 2) return 0xFF;
				
				result = 9+i-4;
				break;
			case 0b00000111:
			
				//#Tak jak w przypadku powyzej
				buttonsClicked++;
				if(buttonsClicked >= 2) return 0xFF;
				
				result = 13+i-4;
				break;
			default: //Jezeli zaden z przypadkow nie wystapil to oznacza aktywacje wiecej niz jednego wiersza wiec
				if(x!=0b00001111) result = 0xFF;	//Po potwierdzeniu zostaje ustawiony kod bledu
		}
	}
	return result;	//Zwroc otrzymana wartosc klawisza
}

int main(void)
{
    DDRA = 0xFF;	//Ustawienie wyjscia na diody
	
	DDRD = 0xF0;	//Ustawienie wyjscia na kolumny i wejscia na wiersze
	PORTD = 0x0F;	//Podciagniecie wejscia wierszy do stanu jedynki
    while (1) 
    {
		PORTA = getKey();	//Wyswietlanie wartosci wciskanych klawiszy na diodach
    }
}