function PickUp (x, y) {

  var PICKUP_WIDTH = 40;
  var PICKUP_HEIGHT = 15;
  var PICKUP_SPEED = 2;
  var MESSAGE_TIME = 2000;
  var PICKUP_TYPES = ["A", "B", "C", "D", "E", "F", "G"];
  var B_TIME = 15000;
  var C_TIME = 8000;
  var D_TIME = 12000;

  this.x = x;
  this.y = y;
  this.width = PICKUP_WIDTH;
  this.height = PICKUP_HEIGHT;
  this.speed = PICKUP_SPEED;
  this.touch_bottom = false;
  this.ended = false;
  this.active = false;
  var rnd = Math.floor(Math.random() * PICKUP_TYPES.length);
  this.type = PICKUP_TYPES[rnd];
  if (this.type == "G") {
    this.score = 500;
  }
  else {
    this.score = 200;
  }
  var expand_sound = new Audio('./resources/sounds/expand.wav');
  var barrier_sound = new Audio('./resources/sounds/barrier.wav');
  var pickup_svg;
  var letter_svg;
  var message_svg;
  var timer_message;
  var timer;
  var timer_running;

  //Dibuja el SVG.
  this.init = function (container) {
    pickup_svg = container.rect(this.x, this.y, PICKUP_WIDTH, PICKUP_HEIGHT, 10, 10);
    letter_svg = container.text(this.x + 14, this.y + 12, this.type);
    letter_svg.addClass('pickupletter');
    switch (this.type) {
      case "A": pickup_svg.addClass('pickup_a');
                break;

      case "B": pickup_svg.addClass('pickup_b');
                break;

      case "C": pickup_svg.addClass('pickup_c');
                break;

      case "D": pickup_svg.addClass('pickup_d');
                break;

      case "E": pickup_svg.addClass('pickup_e');
                break;

      case "F": pickup_svg.addClass('pickup_f');
                break;

      case "G": pickup_svg.addClass('pickup_g');
                break;
    }
  };

  //Mensaje al tocar el pickup.
  function message(paddle, message, container, viewbox) {
    if (paddle.x < (viewbox.width / 2)) {
      message_svg = container.text(paddle.x + 100, paddle.y, message);
    }
    else {
      message_svg = container.text(paddle.x - 50, paddle.y, message);
    }
    message_svg.addClass('pickupmessage');
    message_svg.animate({y: paddle.y - 40}, 2000);
    timer_message = setTimeout(function(){
      message_svg.remove();
    }, MESSAGE_TIME);
  }

  this.removeMessage = function () {
    message_svg.remove();
  };

  this.effect = function(player) {
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
                  expand_sound.cloneNode(true).play();
                  player.paddle.expand(player.viewbox);
                  message(player.paddle, "Expand!", player.container, player.viewbox);
                  timer_running = true;
                  timer = setTimeout(function(){
                    player.paddle.compress();
                    timer_running = false;
                    this.ended = true;
                  }, B_TIME);
                }
                break;

      //Cambia de forma, permite disparar.
      case "C": if (!this.active) {
                  this.active = true;
                  player.paddle.cannonForm();
                  message(player.paddle, "Cannon Form!", player.container, player.viewbox);
                  timer_running = true;
                  timer = setTimeout(function(){
                    player.paddle.endCannonForm();
                    timer_running = false;
                    this.ended = true;
                  }, C_TIME);
                }
                break;

      //Se agrega la barrera.
      case "D": if (!this.active) {
                  this.active = true;
                  barrier_sound.cloneNode(true).play();
                  player.paddle.barrierForm(player.container);
                  message(player.paddle, "Barrier!", player.container, player.viewbox);
                  timer_running = true;
                  timer = setTimeout(function(){
                    player.paddle.endBarrierForm(player.container);
                    timer_running = false;
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
    }
  };

  this.endEffect = function(balls, paddle) {
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

      case "B": if (timer_running) {
                  clearInterval(timer);
                  timer_running = false;
                }
                paddle.compress();
                this.ended = true;
                break;

      case "C": if (timer_running) {
                  clearInterval(timer);
                  timer_running = false;
                }
                paddle.endCannonForm();
                this.ended = true;
                break;

      case "D": if (timer_running) {
                  clearInterval(timer);
                  timer_running = false;
                }
                paddle.endBarrierForm();
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
    pickup_svg.remove();
    letter_svg.remove();
  };

  this.draw = function() {
    if (this.touch_bottom) {
      this.remove();
    }
    else {
      pickup_svg.attr({y:this.y});
      letter_svg.attr({y:this.y + 12});
    }
  };

}
