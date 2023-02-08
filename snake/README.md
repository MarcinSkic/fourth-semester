# Snake for ATMega32
It is compiled and run using [AVR Studio 4](https://www.microchip.com/en-us/tools-resources/develop/microchip-studio) and simulated on software "Hapsim" due to lack of microchip in home. Previously tested on ZL3AVR board.
## Features
- Game of snake, it walks through walls by teleporting to other side
- When eats apple it grows and new apple is spawned
- When gets to length 10 game is won, if you hit snake body you lose
## Cable connections
- SOON&trade;
## Controls
- Keypad buttons: movement
  - 1 row, 3 col: UP
  - 2 row, 2 col: LEFT
  - 2 row, 4 col: RIGHT
  - 3 row, 3 col: DOWN
## Development
### Finished
- Moving snake ✔️
- Snake becoming longer when eats apple ✔️
- Apple spawning after being eaten ✔️
- Snake detecting collisions with himself ✔️
### Bugs
- Snake sometimes doesn't detect collision when ❌
- Apple sometimes doesn't spawn ❌
### Ideas
- Pick difficulty: snake has different speed
- Snake v2: Body of snake is the size of one pixel on display, and then walls are impassable

###### Version: 1.2.0
---
### Used technologies
[<img align="left" alt="Embedded C" width="26px" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/embeddedc/embeddedc-original.svg" style="padding-right:10px;" />][embedded-c]
[<img align="left" alt="Atmel Studio" width="26px" src="https://user-images.githubusercontent.com/33003089/212467784-e56c7958-7bd5-42fa-abfd-2756ecd99206.png" style="padding-right:10px;" />][atmel-studio]

[embedded-c]: https://en.wikipedia.org/wiki/Embedded_C
[atmel-studio]: https://www.microchip.com/en-us/tools-resources/develop/microchip-studio
