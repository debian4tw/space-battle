# space-battle
A prototype of a network multiplayer "space invaders" like game for the browser.
This is a kind of old javascript port from an older C++ game made at university.
I didn´t use any game engine, back in the day it was just a fun way to play around with node, canvas and websockets.

It is composed of:
* An authoritative server with node, express and socket.io
* A dumb client which just takes sends commands to the server/receives the game state via socket.io and renders the game with canvas.


![Screenshot](https://github.com/debian4tw/space-battle/public/images/screenshot.png "Screenshot")


 