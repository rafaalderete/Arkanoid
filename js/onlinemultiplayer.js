//Clase Principal del juego.
function Arkanoid() {

  var LEVELS = 5;
  var GAMEOVER_HEIGHT = 100;
  var SEARCHING = 0;
  var MATCHING = 1;
  var MATCHED = 2;
  var SINGLEPLAYER = 0;
  var LOCALMULTIPLAYER = 1;
  var ONLINEMULTIPLAYER = 2;

  this.game_matched = false;
  this.game_status = SEARCHING;
  this.id_game = "";
  this.player_data_id = "";
  this.rival_data_id = "";
  this.player_initial_data_id = "";
  this.rival_initial_data_id = "";
  this.game_abandon = false;
  this.level;
  var players = [new PlayerMultiPlayer (ONLINEMULTIPLAYER, 0, 1, Snap("#container1")), new PlayerMultiPlayer (ONLINEMULTIPLAYER, 1, 1, Snap("#container2"))];
  var game_started1 = false;
  var game_started2 = false;
  var background_start_player1_svg;
  var controls_player1_svg;
  var background_start_player2_svg;
  var ready1_svg;
  var ready2_svg;
  var abandon_svg;
  var waiting_svg;
  var initial_data_received = false;
  var ball_sync_received = false;

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

  function gameEnded() {
    if ( (players[0].lifes === 0) || (players[1].lifes === 0) ) {
      return true;
    }
    else {
      if ( (players[0].level.amount_bricks === 0) || (players[1].level.amount_bricks === 0) ) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  //Chequea si las vidas de alguno de los jugadores es 0 o si la cantidad de bloques restantes es 0,
  //muestra los mensajes correspodientes y envía resultados.
  this.checkGameOver = function() {
    if ( (players[0].lifes === 0) || (players[1].lifes === 0) ) {
      if ( (players[0].lifes === 0) ) {
          loseMessage(players[0].container, players[0].viewbox);
          winMessage(players[1].container, players[1].viewbox);
          this.sendGameResult("LOSE");
      }
      else {
        loseMessage(players[1].container, players[1].viewbox);
        winMessage(players[0].container, players[0].viewbox);
        this.sendGameResult("WIN");
      }
      return true;
    }
    else {
      if ( (players[0].level.amount_bricks === 0) || (players[1].level.amount_bricks === 0) ) {
        if ( (players[0].level.amount_bricks === 0) ) {
            loseMessage(players[1].container, players[1].viewbox);
            winMessage(players[0].container, players[0].viewbox);
            this.sendGameResult("WIN");
        }
        else {
          loseMessage(players[0].container, players[0].viewbox);
          winMessage(players[1].container, players[1].viewbox);
          this.sendGameResult("LOSE");
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
    players[0].init();
    players[1].init();
    players[0].initLevel(this.level);
    players[1].initLevel(this.level);
    var controls1_svg = players[0].container.text(players[0].viewbox.width/2 - 40, players[0].viewbox.height/2 - 50, "Controls:");
    var controls2_svg = players[0].container.text(players[0].viewbox.width/2 - 55, players[0].viewbox.height/2 - 25, "Z: Move Left");
    var controls3_svg = players[0].container.text(players[0].viewbox.width/2 - 55, players[0].viewbox.height/2 - 5, "X: Move Right");
    var controls4_svg = players[0].container.text(players[0].viewbox.width/2 - 90, players[0].viewbox.height/2 + 100, "Press \"Space\" to Start.");
    controls1_svg.addClass('levelmessage');
    controls2_svg.addClass('levelmessage');
    controls3_svg.addClass('levelmessage');
    controls4_svg.addClass('levelmessage');
    background_start_player1_svg = players[0].container.rect(0, 0, players[0].container.attr('width'), players[0].container.attr('height'));
    background_start_player1_svg.addClass('backgroundlevel');
    controls_player1_svg = players[0].container.g(controls1_svg, controls2_svg, controls3_svg, controls4_svg);
    background_start_player2_svg = players[1].container.rect(0, 0, players[1].container.attr('width'), players[1].container.attr('height'));
    background_start_player2_svg.addClass('backgroundlevel');
    //Petición al servidor para obtener el nombre del jugador.
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/receive_player_name.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var name_svg = players[0].container.text(3, players[0].viewbox.height - 5, xhr.responseText);
        name_svg.addClass('lifescore');
      }
    };
    xhr.send();
  };

  function removeMessages() {
    background_start_player1_svg.remove();
    controls_player1_svg.remove();
    ready1_svg.remove();
    background_start_player2_svg.remove();
    if (ready2_svg != null){
      ready2_svg.remove();
    }
  }

  //Envía los resultados al servidor.
  this.sendGameResult = function(result) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/send_game_result.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("result=" + result);
  };

  this.deleteGame = function() {
    if (this.game_matched) {
      //Chequea si un jugador se fue del juego antes de terminar la partida.
      if (!gameEnded()) {
        this.game_abandon = true;
        alert(this.game_abandon);
        this.sendData(false);
        this.sendGameResult("LOSE");
      }
    }
    //Petición para eliminar la partida y los datos guardados de los jugadores en el servidor.
    var data = {};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/delete_game.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    data.id_game = this.id_game;
    data.player_initial_data_id = this.player_initial_data_id;
    var jsondata= JSON.stringify(data);
    xhr.send("data=" + jsondata);
  };

  //Petición para enviar los datos del jugador al servidor, se envía el id(donde se almacenarán los datos),
  //las bolas, si el juego inició, si el jugador abandonó, la posición del paddle y si es el envío inicial,
  //envía los pickups de los bricks.
  this.sendData = function (initial) {
    var data = {};
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/send_player_data.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    data.game_started = game_started1;
    data.game_abandon = this.game_abandon;
    data.player_paddle_x = players[0].paddle.x;
    data.balls_speed = players[0].balls[0].total_speed;
    data.ball_sync = players[0].ball_sync;
    data.ball_sync_received = ball_sync_received;
    if (initial) {
      data.initial = true;
      data.player_data_id = this.player_initial_data_id;
      data.player_balls = [];
      for (i = 0; i < players[0].balls.length; i++) {
        data.player_balls[i] = ({speed_x:players[0].balls[i].speed_x});
      }
      data.player_bricks = [];
      for (i = 0; i < players[0].level.bricks.length; i++) {
        if (players[0].level.bricks[i].pickup == null) {
          data.player_bricks[i] = ({pickup_type:null});
        }
        else {
          data.player_bricks[i] = ({pickup_type:players[0].level.bricks[i].pickup.type});
        }
      }
    }
    else {
      data.initial = false;
      data.player_data_id = this.player_data_id;
      if (players[0].ball_sync) {
        ball_sync_received = false;
        data.player_balls = [];
        for (i = 0; i < players[0].balls.length; i++) {
          data.player_balls[i] = ({cx:players[0].balls[i].cx,cy:players[0].balls[i].cy,
                speed_x:players[0].balls[i].speed_x,speed_y:players[0].balls[i].speed_y,
                total_speed:players[0].balls[i].total_speed});
        }
      }
    }
    var jsondata= JSON.stringify(data);
    xhr.send("data=" + jsondata);
  };

  //Petición que recibe los datos del jugador rival.
  this.receiveData = function(initial) {
    var data = {};
    var response;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/receive_player_data.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText !== "") {
          response = JSON.parse(xhr.responseText);
          if (response.game_abandon) {
            players[1].lifes--;
            if (abandon_svg == null) {
              abandon_svg = players[1].container.text(players[1].viewbox.width/2 - 110, players[1].viewbox.height/2 + 100, "The Player has left the game!");
              abandon_svg.addClass('levelmessage');
            }
          }
          else {
            game_started2 = response.game_started;
            players[1].paddle.x = response.player_paddle_x;
            for (i = 0; i < players[1].balls.length;i++) {
              players[1].balls[i].total_speed = response.balls_speed;
            }
            //Si es la primera vez que recibe datos, setea el nombre y los pickups de los bricks del rival.
            if (initial) {
              initial_data_received = true;
              var name_svg = players[1].container.text(3, players[1].viewbox.height - 5, response.player_name);
              name_svg.addClass('lifescore');
              for (i = 0; i < players[1].balls.length;i++) {
                players[1].balls[i].speed_x = response.player_balls[i].speed_x;
              }
              for (i = 0; i < players[1].level.bricks.length;i++) {
                if (response.player_bricks[i].pickup_type != null) {
                  players[1].level.bricks[i].pickup = new PickUp(ONLINEMULTIPLAYER, players[1].level.bricks[i].x, players[1].level.bricks[i].y, response.player_bricks[i].pickup_type);
                }
              }
            }
            else {
              if (response.ball_sync) {
                ball_sync_received = true;
                for (i = 0; i < players[1].balls.length;i++) {
                  players[1].balls[i].cx = response.player_balls[i].cx;
                  players[1].balls[i].cy = response.player_balls[i].cy;
                  players[1].balls[i].speed_x = response.player_balls[i].speed_x;
                  players[1].balls[i].speed_y = response.player_balls[i].speed_y;
                  players[1].balls[i].total_speed = response.player_balls[i].total_speed;
                }
              }
              if (response.ball_sync_received) {
                players[0].ball_sync = false;
              }
            }
          }
        }
      }
    };
    if (initial) {
      data.rival_data_id = this.rival_initial_data_id;
    }
    else {
      data.rival_data_id = this.rival_data_id;
    }
    var jsondata= JSON.stringify(data);
    xhr.send("data=" + jsondata);
  };

  //Petición que busca otro jugador, si no hay jugadores disponibles, entonces crea un juego y espera
  //hasta que otro jugador se conecte.
  this.searchGame = function(game) {
    var data = {};
    var response;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/search_game.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        response = JSON.parse(xhr.responseText);
        if (response.game_status == MATCHING) {
          if (game.game_status == SEARCHING) {
            game.game_status = response.game_status;
            game.id_game = response.id_game;
          }
          game.searchGame(game);
        }
        else {
          if (response.game_status == MATCHED) {
            game.game_status = response.game_status;
            game.level = Number(response.level);
            game.player_data_id = response.player_data_id;
            game.player_initial_data_id = response.player_initial_data_id;
            game.rival_data_id = response.rival_data_id;
            game.rival_initial_data_id = response.rival_initial_data_id;
            game.game_matched = true;
            game.init();
            game.sendData(true);
          }
        }
      }
    };
    data.game_status = game.game_status;
    if (game.game_status == MATCHING) {
       data.id_game  = game.id_game;
    }
    var jsondata= JSON.stringify(data);
    xhr.send("data=" + jsondata);
  };

  this.run = function() {
    if (!initial_data_received) {
      this.receiveData(true);
    }
    else {
      this.receiveData(false);
    }
    if (game_started1 && game_started2) {
      removeMessages();
      update();
      draw();
      checkPlayersLoseLife();
    }
    else {
      if (Key.isDown(Key.START)) {
        game_started1 = true;
        if (ready1_svg == null) {
          ready1_svg = players[0].container.text(players[0].viewbox.width/2 - 30, players[0].viewbox.height/2 + 150, "Ready!");
          ready1_svg.addClass('levelmessage');
        }
      }
      if (game_started2) {
        if (ready2_svg == null) {
          ready2_svg = players[1].container.text(players[1].viewbox.width/2 - 30, players[1].viewbox.height/2 + 150, "Ready!");
          ready2_svg.addClass('levelmessage');
        }
      }
    }
    this.sendData(false);
  };

}

//Main.
$(document).ready(function() {
  var elementExists = document.getElementById("container1");
  if (elementExists != null) {
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    var game = new Arkanoid();
    game.searchGame(game);
    var loop = setInterval(function() {
      if (game.game_matched) {
        $('.waiting').css("display", "none");
        game.run();
        if (game.checkGameOver()){
          game.deleteGame();
          clearInterval(loop);
        }
      }
    }, 1000/30);

    window.onbeforeunload = function(){
        game.deleteGame();
    };
  }
});
