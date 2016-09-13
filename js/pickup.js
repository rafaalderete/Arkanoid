function PickUp (gamemode, x, y, type) {

  var SINGLEPLAYER = 0;
  var LOCALMULTIPLAYER = 1;
  var ONLINEMULTIPLAYER = 2;
  var PICKUP_WIDTH = 40;
  var PICKUP_HEIGHT = 15;
  var PICKUP_SPEED = 2;
  var MESSAGE_TIME = 2000;
  var PICKUP_TYPES_SINGLE = ["A", "B", "C", "D", "E", "F", "G"];
  var PICKUP_TYPES_MULTI = ["A", "B", "D", "E", "F", "H", "I", "J"];
  var B_TIME = 15000;
  var C_TIME = 8000;
  var D_TIME = 12000;
  var I_TIME = 5000;
  var J_TIME = 400;

  this.x = x;
  this.y = y;
  this.width = PICKUP_WIDTH;
  this.height = PICKUP_HEIGHT;
  this.speed = PICKUP_SPEED;
  this.touch_bottom = false;
  this.ended = false;
  this.active = false;
  this.score;
  this.type;
  this.pickup_types;
  if (gamemode == SINGLEPLAYER) {
    this.pickup_types = PICKUP_TYPES_SINGLE;
    var rnd = Math.floor(Math.random() * this.pickup_types.length);
    this.type = this.pickup_types[rnd];
    if (this.type == "G") {
      this.score = 500;
    }
    else {
      this.score = 200;
    }
  }
  else {
    this.pickup_types = PICKUP_TYPES_MULTI;
    if (type == null) {
      var rnd = Math.floor(Math.random() * this.pickup_types.length);
      this.type = this.pickup_types[rnd];
    }
    else {
      this.type = type;
    }
  }
  this.expand_sound = new Audio('./resources/sounds/expand.wav');
  this.barrier_sound = new Audio('./resources/sounds/barrier.wav');
  this.pickup_svg;
  this.letter_svg;
  this.message_svg;
  this.timer_message;
  this.timer;
  this.timer_running;

  //Dibuja el SVG.
  this.init = function (container) {
    this.pickup_svg = container.rect(this.x, this.y, PICKUP_WIDTH, PICKUP_HEIGHT, 10, 10);
    if (this.type != "I") {
        this.letter_svg = container.text(this.x + 14, this.y + 12, this.type);
    }
    else {
        this.letter_svg = container.text(this.x + 18, this.y + 12, this.type);
    }
    this.letter_svg.addClass('pickupletter');
    switch (this.type) {
      case "A": this.pickup_svg.addClass('pickup_a');
                break;

      case "B": this.pickup_svg.addClass('pickup_b');
                break;

      case "C": this.pickup_svg.addClass('pickup_c');
                break;

      case "D": this.pickup_svg.addClass('pickup_d');
                break;

      case "E": this.pickup_svg.addClass('pickup_e');
                break;

      case "F": this.pickup_svg.addClass('pickup_f');
                break;

      case "G": this.pickup_svg.addClass('pickup_g');
                break;

      case "H": this.pickup_svg.addClass('pickup_h');
                break;

      case "I": this.pickup_svg.addClass('pickup_i');
                break;

      case "J": this.pickup_svg.addClass('pickup_j');
                break;
    }
  };

  //Mensaje al tocar el pickup.
  function message(paddle, message, container, viewbox, isrival = false) {
    clearInterval(this.timer_message);
    if (this.message_svg != null) {
      this.message_svg.remove();
    }
    if (paddle.x < (viewbox.width / 2)) {
      this.message_svg = container.text(paddle.x + 100, paddle.y, message);
    }
    else {
      this.message_svg = container.text(paddle.x - 50, paddle.y, message);
    }
    if (!isrival){
      this.message_svg.addClass('pickupmessage');
    }
    else {
      this.message_svg.addClass('pickupmessagerival');
    }
    this.message_svg.animate({y: paddle.y - 40}, 2000);
    this.timer_message = setTimeout(function(){
      if (this.message_svg != null) {
        this.message_svg.remove();
      }
    }, MESSAGE_TIME);
  }

  this.removeMessage = function () {
    if (this.message_svg != null) {
      this.message_svg.remove();
    }
  };

  this.effect = function(player, rival) {
    switch (this.type) {
      //Agrega 2 bolas.
      case "A": if (!this.active) {
                  player.balls[1] = new Ball (player.balls[0].cx, player.balls[0].cy, player.balls[0].total_speed, true, false);
                  player.balls[2] = new Ball (player.balls[0].cx, player.balls[0].cy, player.balls[0].total_speed, false, true);
                  player.balls[1].init(player.container);
                  player.balls[2].init(player.container);
                  this.active = true;
                  message(player.paddle, "Multiball!", player.container, player.viewbox);
                }
                break;

      //Incrementa el ancho del paddle.
      case "B": if (!this.active) {
                  this.active = true;
                  this.expand_sound.cloneNode(true).play();
                  player.paddle.expand(player.viewbox);
                  message(player.paddle, "Expand!", player.container, player.viewbox);
                  this.timer_running = true;
                  this.timer = setTimeout(function(){
                    player.paddle.compress();
                    this.timer_running = false;
                    this.ended = true;
                  }, B_TIME);
                }
                break;

      //Cambia de forma, permite disparar.
      case "C": if (!this.active) {
                  this.active = true;
                  player.paddle.cannonForm();
                  message(player.paddle, "Cannon Form!", player.container, player.viewbox);
                  this.timer_running = true;
                  this.timer = setTimeout(function(){
                    player.paddle.endCannonForm();
                    this.timer_running = false;
                    this.ended = true;
                  }, C_TIME);
                }
                break;

      //Se agrega la barrera.
      case "D": if (!this.active) {
                  this.active = true;
                  this.barrier_sound.cloneNode(true).play();
                  player.paddle.barrierForm(player.container);
                  message(player.paddle, "Barrier!", player.container, player.viewbox);
                  this.timer_running = true;
                  this.timer = setTimeout(function(){
                    player.paddle.endBarrierForm(player.container);
                    this.timer_running = false;
                    this.ended = true;
                  }, D_TIME);
                }
                break;

      //Incrementa la aceleracíon de las bolas.
      case "E": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(player.paddle, "+ Ball Speed!", player.container, player.viewbox);
                  for (i = 0; i < player.balls.length; i++) {
                    player.balls[i].total_speed = player.balls[i].total_speed + 1;
                  }
                }
                break;

      //Decrementa la aceleracíon de las bolas.
      case "F": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(player.paddle, "- Ball Speed!", player.container, player.viewbox);
                  for (i = 0; i < player.balls.length; i++) {
                    player.balls[i].total_speed = player.balls[i].total_speed - 1;
                  }
                }
                break;

      //Agrega una vida.
      case "G": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(player.paddle, "+ Life!", player.container, player.viewbox);
                  player.lifes++;
                  player.updateLifes();
                }
                break;

      //Incrementa la aceleracíon de las bolas del rival.
      case "H": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(rival.paddle, "+ Ball Speed!", rival.container, rival.viewbox, true);
                  for (i = 0; i < rival.balls.length; i++) {
                    rival.balls[i].total_speed = rival.balls[i].total_speed + 1;
                  }
                }
                break;

      //Elimina el pickup en pantalla del rival y el pickup activo.
      case "I": if (!this.active) {
                  this.active = true;
                  if (rival.pickup_active != null) {
                    if (!rival.pickup_active.ended) {
                      rival.pickup_active.endEffect(rival.balls, rival.paddle, rival);
                    }
                  }
                  rival.pickup_active = null;
                  if (rival.pickup != null) {
                    if (rival.pickup_floating) {
                      rival.pickup.remove();
                      rival.pickup_floating = false;
                    }
                  }
                  rival.pickup = null;
                  rival.pickup_blocked = true;
                  message(rival.paddle, "No Pickup!", rival.container, rival.viewbox, true);
                  this.timer_running = true;
                  this.timer = setTimeout(function(){
                    rival.pickup_blocked = false;
                    this.timer_running = false;
                    this.ended = true;
                  }, I_TIME);
                }
                break;

      //El rival no se puede mover.
      case "J": if (!this.active) {
                  this.active = true;
                  rival.paddle.can_move = false;
                  message(rival.paddle, "Can't move!", rival.container, rival.viewbox, true);
                  this.timer_running = true;
                  this.timer = setTimeout(function(){
                    rival.paddle.can_move = true;
                    this.timer_running = false;
                    this.ended = true;
                  }, J_TIME);
                }
                break;
    }
  };

  this.endEffect = function(balls, paddle, rival) {
    this.removeMessage();
    switch (this.type) {
      case "A": if (this.active && !this.ended) {
                  var count = 0;
                  var ball;
                  for(i = 0; i < balls.length; i ++) {
                    if (balls[i].touch_bottom) {
                        balls[i].remove();
                        count++;
                    }
                    else {
                      ball = balls[i];
                    }
                  }
                  if (count == 2) {
                    for (i = 0; i < 2; i++) {
                      balls.pop();
                    }
                    balls[0] = ball;
                    this.ended = true;
                  }
                }
                break;

      case "B": if (this.timer_running) {
                  clearInterval(this.timer);
                  this.timer_running = false;
                }
                paddle.compress();
                this.ended = true;
                break;

      case "C": if (this.timer_running) {
                  clearInterval(this.timer);
                  this.timer_running = false;
                }
                paddle.endCannonForm();
                this.ended = true;
                break;

      case "D": if (this.timer_running) {
                  clearInterval(this.timer);
                  this.timer_running = false;
                }
                paddle.endBarrierForm();
                this.ended = true;
                break;

      case "I": if (this.timer_running) {
                  clearInterval(this.timer);
                  this.timer_running = false;
                }
                rival.pickup_blocked = false;
                this.ended = true;
                break;

      case "J": if (this.timer_running) {
                  clearInterval(this.timer);
                  this.timer_running = false;
                }
                rival.paddle.can_move = true;
                this.ended = true;
                break;
    }
  };

//Actualiza la posición y chequea si toca el fondo del viewbox.
  this.update = function (viewbox) {
    this.y = this.y + this.speed;
    if (this.y > viewbox.height) {
      this.touch_bottom = true;
    }
  };

  this.remove = function() {
    this.pickup_svg.remove();
    this.letter_svg.remove();
  };

  this.draw = function() {
    if (this.touch_bottom) {
      this.remove();
    }
    else {
      this.pickup_svg.attr({y:this.y});
      this.letter_svg.attr({y:this.y + 12});
    }
  };

}
