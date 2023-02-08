/*
 * lab5_Calculator.c
 *
 * Created: 2022-05-25 08:07:00
 * Author : Student
 */ 

#include <avr/io.h>
#include <util/delay.h>

void updateDisplay(int displayedNumber, unsigned char cyfry[]){
	PORTD = ~(1<<3);	//Wlaczenie kolumny jednosci
	PORTA = 0xFF;	//Wylaczenie segmentow zeby zapobiec "cieniowi" poprzednich liczb
	PORTA = cyfry[displayedNumber%10];	//Wyswietlenie cyfry
	_delay_ms(1);

	if(displayedNumber >= 10){	//Cyfra dziesiatek
		PORTD = ~(1<<2);	//Wlaczenie kolumny dziesiatek
		PORTA = 0xFF;	//Wylaczenie segmentow zeby zapobiec "cieniowi" poprzednich liczb
		PORTA = cyfry[(displayedNumber/10)%10];	//Wyswietlenie cyfry
	
	}
	_delay_ms(1);

	if(displayedNumber >= 100){	//Cyfra setek
		//#Tak jak powyzej
		PORTD = ~(1<<1);
		PORTA = 0xFF;
		PORTA = cyfry[(displayedNumber/100)%10];
	
	}
	_delay_ms(1);

	if(displayedNumber >= 1000){	//Cyfra tysiecy
		//#Tak jak powyzej
		PORTD = ~(1<<0);
		PORTA = 0xFF;
		PORTA = cyfry[(displayedNumber/1000)%10];
	}
	_delay_ms(1);
}

int getKey(){	//Metoda sluzaca do odczytywania wartosci wcisnietego klawisza na klawiaturze
	int x, result = 0, buttonsClicked = 0; //x - bitowa wartosc wcisniecia odczytywana z PIND, result - zwracana wartosc wcisniecia czyli wartosc klawisza, 0 lub kod bledu (FF), buttonsClicked - zmienna zliczajaca wcisniecia w trakcie jednego przejscia petli sluzaca do wykrycia wielokrotnego wcisniecia "po przekatnej"
	for(int i = 4; i < 8; i++){	//Petla przechodzaca 4 razy do nadawania stanu "krazacego zera"
		PORTB = ~(1<<i);	//Ustawienie portu w taki sposob ze rejestrujemy wcisniecia klawiszy tylko w jednej kolumnie
		_delay_ms(1);	
		
		x = PINB & 0x0F;	//Wymnozenie logiczne wartosci rejestru PIND w taki sposob ze usuwamy wartosci kolumn ktore nas nie interesuja (zerujemy je) i zostaja nam tylko bity wskazujace na wiersze
		_delay_ms(1);
		
		if(x != (PINB & 0x0F)) break;	//Sprawdzenie po opoznieniu czy wartosc jest nadal taka sama zeby usunac przypodkowe zwarcia na stykach
		
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
			default:	//Jezeli zaden z przypadkow nie wystapil to oznacza aktywacje wiecej niz jednego wiersza wiec
				if(x!=0b00001111) result = 0xFF;	//Po potwierdzeniu zostaje ustawiony kod bledu
		}
	}
	return result;	//Zwroc otrzymana wartosc klawisza
}

void calculator(){
	DDRA = 0xFF;	//Ustawienie wyjscia na segmenty wyswietlacza
	PORTA = 0xFF;	//Wylaczenie segmentow
	
	DDRD = 0x0F;	//Ustawienie wyjscia na kolumny wyswietlacza
	
	DDRB = 0xF0;	//Ustawienie wyjscia na kolumny i wejscia na wiersze
	PORTB = 0x0F;	//Podciagniecie wejscia wierszy do stanu jedynki
	
	unsigned char cyfry[] = {0b11000000,0b11111001,0b10100100,0b10110000,0b10011001,0b10010010,0b10000010,0b11111000,0b10000000,0b10010000};	//Cyfry uzywane na wyswietlaczu 7Seg
	
	int clickedNumber;	//Zmienna przechowujaca informacje o tym co zostalo wcisniete
	int displayedNumber = 0;	//Aktualnie wyswietlana liczbe na wyswietlaczu
	int loadedNumber = 0;	//Liczba zaladowana do obliczen po wybraniu operacji
	int isDisplayActive = 0;	//Wartosc wskazujaca czy nastepna wcisnieta cyfra ma zostac dopisana do liczby na wyswietlaczu (wartosc 1) czy ma ja nadpisac (wartosc 0)
	int operation = 0;	//Wartosc wskazujaca na wybrana operacje (0 - brak, 12 - dodawanie, 13 - odejmowanie, 14 - mnozenie, 15 - dzielenie)
	
	while(1){
		
		//OUTPUT
		updateDisplay(displayedNumber,cyfry);	//Wyswietlanie aktualnej liczby na wyswietlaczu
		
		//INPUT
		clickedNumber = getKey();	//Pobieranie informacji z klawiatury
		
		if(clickedNumber == 0xFF){	//Resetowanie kalkulatora w razie wprowadzenia nieprawidlowych danych (wiecej niz jeden klawisz na klawiaturze)
			displayedNumber = 0;
			isDisplayActive = 0;
			loadedNumber = 0;
			continue;
		}
		
		//PROCESSING
		if(clickedNumber > 0 && clickedNumber <= 16){	//Upewnienie sie czy wartosc z klawiatury sie zgadza
			for(int i = 0; i<100; i++){
				updateDisplay(displayedNumber,cyfry);	//Opoznienie wykonane bez przerywania wyswietlania w celu unikniecia przypadkowych wielokrotnych wcisniec
			}
			
			if(clickedNumber <= 10){	//DIGITS
				if(displayedNumber >= 1000) continue;	//Pominiecie wcisniecia cyfry jesli nie zmiescilaby sie na wyswietlaczu
				
				if(!isDisplayActive){	//Sprawdzenie czy nalezy nadpisac aktualna wyswietlana liczbe
					displayedNumber = 0;
					isDisplayActive = 1;
				}
				
				if(clickedNumber == 10){	//Klawisz numer 10 odpowiada za cyfre 0
					clickedNumber = 0;
				}
				
				displayedNumber *= 10;	//Przesun liczbe o jedna pozycje wyzej
				displayedNumber += clickedNumber;	//Dodaj wcisnieta cyfre jako wartosc jednosci
				continue;
			}
			
			
			
			if(clickedNumber == 11){	//CLEAR	Wyczyszczenie wszystkich zmiennych, restart kalkulatora
				displayedNumber = 0;
				isDisplayActive = 0;
				loadedNumber = 0;
				operation = 0;
				continue;
			}
			
			if(clickedNumber == 16 && loadedNumber){	//EQUALS
				_delay_ms(300);	//Opoznienie majace stworzyc efekt "mrugniecia" wyswietlacza zeby zasygnalizowac uzytkownikowi ze wprowadzona operacja zostala przyjeta
				int result;	//Zmienna tymczasowa
				switch (operation){
					case 12:
						result = displayedNumber + loadedNumber;	//Dodawanie
						if(result <= 9999) displayedNumber = result;	//Zabezpieczenie przed przepelnieniem wyswietlacza
						break;
					case 13:
						result = loadedNumber - displayedNumber;	//Odejmowanie
						if(result >= 0) displayedNumber = result;	//Zabezpieczenie przed liczbami ujemnymi
						break;
					case 14:
						result = displayedNumber * loadedNumber;	//Mnozenie
						if(result <= 9999) displayedNumber = result;	//Zabezpieczenie przed przepelnieniem wyswietlacza
						break;
					case 15:
						if(displayedNumber == 0 && isDisplayActive) break;	//Zabezpieczenie przed dzieleniem przez 0
						displayedNumber = loadedNumber / displayedNumber;	//Dzielenie
						break;
					default:
						continue;	//Przy braku wybranej operacji zrezygnuj z dzialania i wroc do zwyklej pracy
				}
	
				operation = 0;	//Zresetowanie operacji
				loadedNumber = 0;	//Usuniecie zaladowanej liczby
				isDisplayActive = 0;	//Wyswietlacz jest mozliwy do nadpisania. 
										//Jednak jezeli uzytkownik wcisnie teraz operator to wynik zostanie zaladowany jako liczba do kolejnych obliczen
				continue;	//Kontynuuj zwykla prace
			}
			
			//OPERATORS (+, -, *, /)
			//Brakuje w tym miejscu konstrukcji if bo nie ma juz wiecej mozliwosci ponad wartosci operatorow, zapobiega temu nadrzedny if
			_delay_ms(300);	 //Opoznienie majace stworzyc efekt "mrugniecia" wyswietlacza zeby zasygnalizowac uzytkownikowi ze wprowadzona operacja zostala przyjeta
			operation = clickedNumber;	//Przypisz wybrana operacje
			loadedNumber = displayedNumber;	//Zaladuj liczbe z wyswietlacza
			isDisplayActive = 0;	//Wyswietlacz jest mozliwy do nadpisania
		}
	}
}

int main(void)
{
    calculator();
}

