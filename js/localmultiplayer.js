//Clase Principal del juego.
function Arkanoid() {

  var LEVELS = 5;
  var GAMEOVER_HEIGHT = 100;

  var players = [new Player (0, 1, Snap("#container1")), new Player (1, 1, Snap("#container2"))];
  var game_started1 = false;
  var game_started2 = false;
  var background_start_player1_svg;
  var controls_player1_svg;
  var background_start_player2_svg;
  var controls_player2_svg;
  var ready1_svg;
  var ready2_svg;

  function checkPlayersLoseLife() {
    if (players[0].checkLoseLife()) {
      players[0].lifes--;
    }
    if (players[1].checkLoseLife()) {
      players[1].lifes--;
    }
  }

  function update() {
    players[0].update(players[1]);
    players[1].update(players[0]);
  }

  function draw() {
    players[0].draw();
    players[1].draw();
  }

  function winMessage(container, viewbox) {
    var win1_svg = container.rect(0, viewbox.height/2 -55, container.attr('width'), GAMEOVER_HEIGHT);
    var win2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2, "You Win!");
    win1_svg.addClass('win');
    win2_svg.addClass('levelmessage');
  }

  function loseMessage(container, viewbox) {
    var lose1_svg = container.rect(0, viewbox.height/2 -55, container.attr('width'), GAMEOVER_HEIGHT);
    var lose2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2, "You Lose!");
    lose1_svg.addClass('lose');
    lose2_svg.addClass('levelmessage');
  }

  //Chequea si las vidas de alguno de los jugadores es 0 o si la cantidad de bloques restantes es 0
  // y muestra los mensajes correspodientes.
  this.checkGameOver = function() {
    if ( (players[0].lifes === 0) || (players[1].lifes === 0) ) {
      if ( (players[0].lifes === 0) ) {
          loseMessage(players[0].container, players[0].viewbox);
          winMessage(players[1].container, players[1].viewbox);
      }
      else {
        loseMessage(players[1].container, players[1].viewbox);
        winMessage(players[0].container, players[0].viewbox);
      }
      return true;
    }
    else {
      if ( (players[0].level.amount_bricks === 0) || (players[1].level.amount_bricks === 0) ) {
        if ( (players[0].level.amount_bricks === 0) ) {
            loseMessage(players[1].container, players[1].viewbox);
            winMessage(players[0].container, players[0].viewbox);
        }
        else {
          loseMessage(players[0].container, players[0].viewbox);
          winMessage(players[1].container, players[1].viewbox);
        }
        return true;
      }
      else {
        return false;
      }
    }
  };

  this.init = function() {
    for (i = 0; i < players.length; i++) {
      var background = players[i].container.rect(0, 0, players[i].container.attr('width'), players[i].container.attr('height'));
      background.addClass('backgroundlevel');
    }
    var rnd = Math.floor((Math.random() * LEVELS) + 1);
    players[0].init();
    players[1].init();
    players[0].initLevel(rnd);
    players[1].initLevel(rnd);
    for (i = 0; i < players.length; i++) {
      var controls1_svg = players[i].container.text(players[i].viewbox.width/2 - 40, players[i].viewbox.height/2 - 50, "Controls:");
      if (i === 0) {
        var controls2_svg = players[i].container.text(players[i].viewbox.width/2 - 55, players[i].viewbox.height/2 - 25, "Z: Move Left");
        var controls3_svg = players[i].container.text(players[i].viewbox.width/2 - 55, players[i].viewbox.height/2 - 5, "X: Move Right");
        var controls4_svg = players[i].container.text(players[i].viewbox.width/2 - 90, players[i].viewbox.height/2 + 100, "Press \"Space\" to Start.");
      }
      else {
        var controls2_svg = players[i].container.text(players[i].viewbox.width/2 - 90, players[i].viewbox.height/2 - 25, "Left Arrow: Move Left");
        var controls3_svg = players[i].container.text(players[i].viewbox.width/2 - 90, players[i].viewbox.height/2 - 5, "Right Arrow: Move Right");
        var controls4_svg = players[i].container.text(players[i].viewbox.width/2 - 90, players[i].viewbox.height/2 + 100, "Press \"Enter\" to Start.");
      }
      controls1_svg.addClass('levelmessage');
      controls2_svg.addClass('levelmessage');
      controls3_svg.addClass('levelmessage');
      controls4_svg.addClass('levelmessage');
      if (i === 0) {
        background_start_player1_svg = players[i].container.rect(0, 0, players[i].container.attr('width'), players[i].container.attr('height'));
        background_start_player1_svg.addClass('backgroundlevel');
        controls_player1_svg = players[i].container.g(controls1_svg, controls2_svg, controls3_svg, controls4_svg);
      }
      else {
        background_start_player2_svg = players[i].container.rect(0, 0, players[i].container.attr('width'), players[i].container.attr('height'));
        background_start_player2_svg.addClass('backgroundlevel');
        controls_player2_svg = players[i].container.g(controls1_svg, controls2_svg, controls3_svg, controls4_svg);
      }
    }
  };

  function removeMessages() {
    background_start_player1_svg.remove();
    controls_player1_svg.remove();
    ready1_svg.remove();
    background_start_player2_svg.remove();
    controls_player2_svg.remove();
    ready2_svg.remove();
  }

  this.run = function() {
    if (game_started1 && game_started2) {
      removeMessages();
      update();
      draw();
      checkPlayersLoseLife();
    }
    else {
      if (Key.isDown(Key.START1)) {
        game_started1 = true;
        if (ready1_svg == null) {
          ready1_svg = players[0].container.text(players[0].viewbox.width/2 - 30, players[0].viewbox.height/2 + 150, "Ready!");
          ready1_svg.addClass('levelmessage');
        }
      }
      else {
        if (Key.isDown(Key.START2)) {
          game_started2 = true;
          if (ready2_svg == null) {
            ready2_svg = players[1].container.text(players[1].viewbox.width/2 - 30, players[1].viewbox.height/2 + 150, "Ready!");
            ready2_svg.addClass('levelmessage');
          }
        }
      }
    }
  };

}

//Main.
$(document).ready(function() {

  window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
  window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

  var game = new Arkanoid();
  game.init();
  var loop = setInterval(function() {
    game.run();
    if (game.checkGameOver()){
      clearInterval(loop);
    }
  }, 1000/30);

});
