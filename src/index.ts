import { Game } from '@core/Game';

var game:Game;

window.onload = function() {
  game = new Game();
  game.start();
}

window.onresize = function() {
  game.resize();
}