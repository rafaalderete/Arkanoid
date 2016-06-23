//Controles.
var Key = {
  pressed: {},

  LEFT: 90,
  RIGHT: 88,
  SHOOT: 83,
  START: 32,

  isDown: function(keyCode) {
    return this.pressed[keyCode];
  },

  onKeydown: function(event) {
    this.pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this.pressed[event.keyCode];
  }

};

function Bullet (x, y) {

  var BULLET_WIDTH = 2;
	var BULLET_HEIGHT = 10;
  var BULLET_SPEED = 7;

  this.x = x;
  this.y = y;
  this.width = BULLET_WIDTH;
  this.height = BULLET_HEIGHT;
  this.speed = BULLET_SPEED;
  this.collision = false;
  var bullet_svg;

  this.init = function (container) {
    bullet_svg = container.rect(this.x, this.y, this.width, this.height, 10, 10);
    bullet_svg.addClass('bullet');
  };

  this.update = function (viewbox) {
    if (!this.collision) {
      this.y = this.y - this.speed;
      if (this.y < viewbox.y) {
        this.collision = true;
      }
    }
  };

  this.hit = function () {
    this.collision = true;
  };

  this.remove = function () {
    bullet_svg.remove();
  };

  this.draw = function() {
    if (this.collision) {
      bullet_svg.remove();
    }
    else {
      bullet_svg.attr({y:this.y});
    }
  };

}

function Barrier (y) {

  var BARRIER_INTERVAL_TIME = 50;

  this.active = false;
  this.y = y;
  var barrier1_svg;
  var barrier2_svg;
  var timer_barrier1;
  var timer_barrier2;

  this.initBarrier1 = function(container) {
    barrier1_svg = container.polyline(0, this.y, 30, this.y + 10,
                                      60, this.y, 90, this.y + 10,
                                      120, this.y, 150, this.y + 10,
                                      180, this.y, 210, this.y + 10,
                                      240, this.y, 270, this.y + 10,
                                      300, this.y, 330, this.y + 10,
                                      360, this.y, 390, this.y + 10,
                                      420, this.y, 450, this.y + 10,
                                      480, this.y, 510, this.y + 10,
                                      520, this.y + 5);
    barrier1_svg.addClass('barrier');
  };

  this.initBarrier2 = function(container) {
    barrier2_svg = container.polyline(0, this.y + 15, 30, this.y + 5,
                                      60, this.y + 15, 90, this.y + 5,
                                      120, this.y + 15, 150, this.y + 5,
                                      180, this.y + 15, 210, this.y + 5,
                                      240, this.y + 15, 270, this.y + 5,
                                      300, this.y + 15, 330, this.y + 5,
                                      360, this.y + 15, 390, this.y + 5,
                                      420, this.y + 15, 450, this.y + 5,
                                      480, this.y + 15, 510, this.y + 5,
                                      520, this.y + 10);
    barrier2_svg.addClass('barrier');
  };

  this.barrierForm = function (container) {
    this.active = true;
    this.initBarrier1(container);
    var self = this;
    timer_barrier1 = setInterval(function() {
      if (barrier1_svg == null) {
        self.initBarrier1(container);
      }
      else {
        barrier1_svg.remove();
        barrier1_svg = null;
      }
    }, BARRIER_INTERVAL_TIME);
    timer_barrier2 = setInterval(function() {
      if (barrier2_svg == null) {
        self.initBarrier2(container);
      }
      else {
        barrier2_svg.remove();
        barrier2_svg = null;
      }
    }, BARRIER_INTERVAL_TIME);
  };

  this.endBarrierForm = function () {
    this.active = false;
    clearInterval(timer_barrier1);
    clearInterval(timer_barrier2);
    if (barrier1_svg != null) {
      barrier1_svg.remove();
      barrier1_svg = null;
    }
    if (barrier2_svg != null) {
      barrier2_svg.remove();
      barrier2_svg = null;
    }
  };

}

function Paddle(viewbox) {

  var PADDLE_WIDTH = 60;
	var PADDLE_HEIGHT = 13;
  var PADDLE_BORDER_WIDTH = 10;
  var PADDLE_BORDER_SVG_WIDTH = 40;
  var BOX_CANNON_WIDTH = 15;
  var BOX_CANNON_HEIGHT= 5;
  var CANNON_WIDTH = 5;
  var CANNON_HEIGHT = 10;
  var BOX_BARRIER_WIDTH = 10;
  var BOX_BARRIER_HEIGHT = 10;
  var PADDLE_SPEED = 7;
  var PADDLE_INCREMENT = 50;
  var INCREMENT_TIME = 300;
  var DELAY_SHOT = 600;

  this.center_width = PADDLE_WIDTH;
	this.width = this.center_width + PADDLE_BORDER_WIDTH * 2;
  this.height = PADDLE_HEIGHT;
  this.x = (viewbox.width - this.width) / 2;
  this.y = viewbox.height - PADDLE_HEIGHT - 20;
  this.bullets = [];
  this.barrier = new Barrier(this.y + this.height);
  var cannon_form = false;
  var left_border_svg;
  var center_paddle_svg;
  var right_border_svg;
  var left_box_cannon_svg;
  var left_cannon_svg;
  var right_box_cannon_svg;
  var right_cannon_svg;
  var left_box_barrier_svg;
  var right_box_barrier_svg;
  var can_shoot = true;

  this.init = function (container) {
    left_border_svg = container.rect(this.x, this.y, PADDLE_BORDER_SVG_WIDTH, PADDLE_HEIGHT, 10, 10);
    right_border_svg = container.rect(this.x + PADDLE_BORDER_SVG_WIDTH, this.y, PADDLE_BORDER_SVG_WIDTH, PADDLE_HEIGHT, 10 ,10);
    left_cannon_svg = container.rect(this.x + PADDLE_BORDER_WIDTH + 5, this.y, CANNON_WIDTH, CANNON_HEIGHT);
    left_box_cannon_svg = container.rect(this.x + PADDLE_BORDER_WIDTH, this.y, BOX_CANNON_WIDTH, BOX_CANNON_HEIGHT);
    right_cannon_svg = container.rect(this.x + PADDLE_WIDTH + PADDLE_BORDER_WIDTH - 10, this.y, CANNON_WIDTH, CANNON_HEIGHT);
    right_box_cannon_svg = container.rect(this.x + PADDLE_WIDTH + PADDLE_BORDER_WIDTH - 15, this.y, BOX_CANNON_WIDTH, BOX_CANNON_HEIGHT);
    left_box_barrier_svg = container.rect(this.x + 20, this.y, BOX_BARRIER_WIDTH, BOX_BARRIER_HEIGHT);
    right_box_barrier_svg = container.rect(this.x + 50, this.y, BOX_BARRIER_WIDTH, BOX_BARRIER_HEIGHT);
    center_paddle_svg = container.rect(this.x + PADDLE_BORDER_WIDTH, this.y, this.center_width, PADDLE_HEIGHT);
    left_border_svg.addClass('paddleborder');
    right_border_svg.addClass('paddleborder');
    left_cannon_svg.addClass('cannon2');
    right_cannon_svg.addClass('cannon2');
    left_box_cannon_svg.addClass('cannon1');
    right_box_cannon_svg.addClass('cannon1');
    left_box_barrier_svg.addClass('cannon2');
    right_box_barrier_svg.addClass('cannon2');
    center_paddle_svg.addClass('centerpaddle');
  };

  this.barrierForm = function(container) {
    left_box_barrier_svg.animate({height: BOX_BARRIER_HEIGHT + 18}, INCREMENT_TIME);
    right_box_barrier_svg.animate({height: BOX_BARRIER_HEIGHT + 18}, INCREMENT_TIME);
    this.barrier.barrierForm(container);
  };


  this.endBarrierForm = function () {
    left_box_barrier_svg.animate({height: BOX_BARRIER_HEIGHT - 10}, INCREMENT_TIME);
    right_box_barrier_svg.animate({height: BOX_BARRIER_HEIGHT - 10}, INCREMENT_TIME);
    this.barrier.endBarrierForm();
  };

  this.isBarrierActive = function() {
    return this.barrier.active;
  };

  this.cannonForm = function () {
    this.bullets = [];
    cannon_form = true;
    left_box_cannon_svg.animate({y: this.y - 3}, INCREMENT_TIME);
    right_box_cannon_svg.animate({y: this.y - 3}, INCREMENT_TIME);
    left_cannon_svg.animate({y: this.y - 5}, INCREMENT_TIME);
    right_cannon_svg.animate({y: this.y - 5}, INCREMENT_TIME);
  };

  this.endCannonForm = function () {
    cannon_form = false;
    left_box_cannon_svg.animate({y: this.y}, INCREMENT_TIME);
    right_box_cannon_svg.animate({y: this.y}, INCREMENT_TIME);
    left_cannon_svg.animate({y: this.y}, INCREMENT_TIME);
    right_cannon_svg.animate({y: this.y}, INCREMENT_TIME);
  };

  this.shoot = function (container) {
    if (cannon_form && can_shoot) {
      var bullet1 = new Bullet (this.x + 15, this.y - 3);
      var bullet2 = new Bullet (this.x + this.width - 20, this.y - 3);
      bullet1.init(container);
      bullet2.init(container);
      this.bullets.push(bullet1);
      this.bullets.push(bullet2);
      can_shoot = false;
      setTimeout(function(){
        can_shoot = true;
      }, DELAY_SHOT);
    }
  };

  this.expand = function(viewbox) {
    if (this.x + this.width > (viewbox.width - PADDLE_INCREMENT)) {
      this.x = this.x - PADDLE_INCREMENT;
    }
    right_border_svg.animate({width: PADDLE_BORDER_SVG_WIDTH + PADDLE_INCREMENT}, INCREMENT_TIME);
    center_paddle_svg.animate({width: PADDLE_WIDTH + PADDLE_INCREMENT}, INCREMENT_TIME);
    this.center_width = PADDLE_WIDTH + PADDLE_INCREMENT;
    this.width = this.center_width + PADDLE_BORDER_WIDTH * 2;
  };

  this.compress = function() {
    right_border_svg.animate({width: PADDLE_BORDER_SVG_WIDTH}, INCREMENT_TIME);
    center_paddle_svg.animate({width: PADDLE_WIDTH}, INCREMENT_TIME);
    this.center_width = PADDLE_WIDTH;
    this.width = this.center_width + PADDLE_BORDER_WIDTH * 2;
  };

  this.moveRight = function(viewbox) {
    if ((this.x + this.center_width + PADDLE_BORDER_WIDTH * 2 + PADDLE_SPEED) < viewbox.width) {
      this.x = this.x + PADDLE_SPEED;
    }
  };

  this.moveLeft = function() {
    if( (this.x - PADDLE_SPEED) > 0) {
      this.x = this.x - PADDLE_SPEED;
    }
  };

  this.remove = function () {
    left_border_svg.remove();
    right_border_svg.remove();
    center_paddle_svg.remove();
    left_box_cannon_svg.remove();
    right_box_cannon_svg.remove();
    left_cannon_svg.remove();
    right_cannon_svg.remove();
    left_box_barrier_svg.remove();
    right_box_barrier_svg.remove();
    for (i = 0; i < this.bullets.length; i++) {
      this.bullets[i].remove();
    }
  };

  this.update = function (container, viewbox) {
    if (Key.isDown(Key.LEFT)){
      this.moveLeft();
    }
    if (Key.isDown(Key.RIGHT)){
      this.moveRight(viewbox);
    }
    if (Key.isDown(Key.SHOOT)) {
      this.shoot(container);
    }
    for (i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update(viewbox);
    }
  };

  this.draw = function() {
    left_border_svg.attr({x:this.x});
    right_border_svg.attr({x:this.x + PADDLE_BORDER_SVG_WIDTH});
    left_box_cannon_svg.attr({x:this.x + PADDLE_BORDER_WIDTH});
    right_box_cannon_svg.attr({x:this.x + PADDLE_WIDTH + PADDLE_BORDER_WIDTH - 15});
    left_cannon_svg.attr({x:this.x + PADDLE_BORDER_WIDTH + 5});
    right_cannon_svg.attr({x:this.x + PADDLE_WIDTH + PADDLE_BORDER_WIDTH - 10});
    left_box_barrier_svg.attr({x:this.x + 20});
    right_box_barrier_svg.attr({x:this.x + 50});
    center_paddle_svg.attr({x:this.x + PADDLE_BORDER_WIDTH});
    for (i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw();
    }
  };

}

function Ball(cx, cy, speed, multi1, multi2) {

  var BALL_RADIUS = 4;
  var BALL_SPEED = 3;
  var INCREMENT_SPEED = 0.15;
  var INCREMENT_TIME = 4000;

	this.cx = cx;
	this.cy = cy - BALL_RADIUS;
	this.radius = BALL_RADIUS;
  if (multi1 || multi2) {
    if (multi1) {
      this.speed_x = -speed;
    }
    else {
      this.speed_x = speed;
    }
    this.speed_y = -speed * 1.2;
  }
  else {
    if (Math.random() < 0.5) {
      this.speed_x = -speed;
    }
    else {
      this.speed_x = speed;
    }
    this.speed_y = -speed;
  }
  this.total_speed = speed;
  this.touch_bottom = false;
  var speed_timer;
  var ball_svg;

  this.incrementSpeed = function() {
    if (this.speed_x > 0) {
      this.speed_x = this.speed_x + INCREMENT_SPEED;
    }
    else {
      this.speed_x = this.speed_x - INCREMENT_SPEED;
    }
    if (this.speed_y > 0) {
      this.speed_y = this.speed_y + INCREMENT_SPEED;
    }
    else {
      this.speed_y = this.speed_y - INCREMENT_SPEED;
    }
    this.total_speed = this.total_speed + INCREMENT_SPEED;
  };

  this.init = function(container) {
    ball_svg = container.circle(this.cx, this.cy, this.radius);
    ball_svg.addClass('ball');
    var self = this;
    speed_timer = setInterval(function() {
      self.incrementSpeed();
    }, INCREMENT_TIME);
  };

  this.update = function (paddle, viewbox) {
    if ( (this.cx + this.radius + this.speed_x > viewbox.width) || (this.cx - this.radius + this.speed_x < 0) ) {
      this.speed_x = -this.speed_x;
    }
    if (this.cy -this.radius + this.speed_y < 0) {
      this.speed_y = -this.speed_y;
    }
    if (this.cy + this.radius > viewbox.height) {
      this.touch_bottom = true;
    }
    this.cx = this.cx + this.speed_x;
    this.cy = this.cy + this.speed_y;
  };

  this.remove = function () {
    ball_svg.remove();
  };

  this.draw = function() {
    if (this.touch_bottom) {
      ball_svg.remove();
    }
    else {
      ball_svg.attr({cx:this.cx, cy:this.cy});
    }
  };

}

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
  var pickup_svg;
  var letter_svg;
  var message_svg;
  var timer_message;
  var timer;
  var timer_running;

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
      case "A": if (!this.active) {
                  player.balls[1] = new Ball (player.balls[0].cx, player.balls[0].cy, player.balls[0].total_speed, true, false);
                  player.balls[2] = new Ball (player.balls[0].cx, player.balls[0].cy, player.balls[0].total_speed, false, true);
                  player.balls[1].init(player.container);
                  player.balls[2].init(player.container);
                  this.active = true;
                  message(player.paddle, "Multiball!", player.container, player.viewbox);
                }
                break;

      case "B": if (!this.active) {
                  this.active = true;
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

      case "D": if (!this.active) {
                  this.active = true;
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

      case "E": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(player.paddle, "+ Ball Speed!", player.container, player.viewbox);
                  for (i = 0; i < player.balls.length; i++) {
                    player.balls[i].total_speed = player.balls[i].total_speed + 1;
                  }
                }
                break;

      case "F": if (!this.active) {
                  this.active = true;
                  this.ended = true;
                  message(player.paddle, "- Ball Speed!", player.container, player.viewbox);
                  for (i = 0; i < player.balls.length; i++) {
                    player.balls[i].total_speed = player.balls[i].total_speed - 1;
                  }
                }
                break;

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

function Brick(x, y, type) {

  var BRICK_WIDTH = 40;
  var BRICK_HEIGHT = 15;
  var BLINK_TIME = 100;
  var PICKUP_PROB = 0.4;

	this.x = x;
	this.y = y;
  this.width = BRICK_WIDTH;
  this.height = BRICK_HEIGHT;
  this.type = type;
  if (type == 1) {
    this.hits = 1;
    this.score = 100;
  }
  else {
    if (type == 2) {
      this.hits = 2;
      this.score = 300;
    }
    else {
      this.hits = 0;
      this.score = 0;
    }
  }
  if ( (type == 1) || (type == 2) ) {
    var rnd = Math.random();
    if (rnd < PICKUP_PROB) {
      this.pickup = new PickUp(x, y);
    }
  }
  var damaged = false;
  var brick_svg;
  var damage_svg;

  this.init = function(container) {
    var inner_colours = ['innerbricktype1_1', 'innerbricktype1_2', 'innerbricktype1_3', 'innerbricktype1_4', 'innerbricktype1_5', 'innerbricktype1_6'];
    var border_colours = ['borderbricktype1_1', 'borderbricktype1_2', 'borderbricktype1_3', 'borderbricktype1_4', 'borderbricktype1_5', 'borderbricktype1_6'];
    var border_svg = container.rect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
    var inner_svg = container.rect(this.x + 3, this.y + 3, BRICK_WIDTH - 6, BRICK_HEIGHT - 6);
    if (this.type == 1){
      var rnd = Math.floor((Math.random() * inner_colours.length));
      border_svg.addClass(border_colours[rnd]);
      inner_svg.addClass(inner_colours[rnd]);
    }
    else {
      if (this.type == 2) {
        border_svg.addClass('borderbricktype2');
        inner_svg.addClass('innerbricktype2');
      }
      else {
        border_svg.addClass('borderbricktype3');
        inner_svg.addClass('innerbricktype3');
      }
    }
    brick_svg = container.group(border_svg, inner_svg);
  };

  this.hit = function (container) {
    if ( (this.type == 1) && (this.hits > 0) ) {
      this.hits--;
    }
    else {
      if ( (this.type == 2) && (this.hits > 0) ) {
        this.hits--;
        if (!damaged) {
          damaged = true;
          damage_svg = container.polyline(this.x, this.y, this.x+10, this.y+10, this.x+15, this.y+5,
            this.x+20, this.y+10, this.x+25, this.y+2, this.x+38, this.y+11);
          damage_svg.addClass('damagebrick');
        }
      }
      else {
        if (this.type === 0) {
          var blink_svg = container.rect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
          blink_svg.addClass('blinkbrick');
          setTimeout(function(){
            blink_svg.remove();
          }, BLINK_TIME);
        }
      }
    }
  };

  this.remove = function() {
    brick_svg.remove();
  };

  this.draw = function() {
    if ( (this.hits === 0) && (this.type !== 0)) {
      brick_svg.remove();
      if (damage_svg != null) {
        damage_svg.remove();
      }
    }
  };

}


function Player (lifes, container) {

  var BRICK_WIDTH = 40;
  var BRICK_HEIGHT = 15;
  var BALL_SPEED = 2;
  var BRICK_PADDING_Y = 25;
  var BRICKS_LVL1 = 65;
  var BRICKS_LVL2 = 91;
  var BRICKS_LVL3 = 104;
  var BRICKS_LVL4 = 143;
  var BRICKS_LVL5 = 143;


  this.container = container;
  this.viewbox = this.container.attr('viewBox');
  this.lifes = lifes;
  this.paddle = new Paddle(this.viewbox);
  this.balls = [new Ball(this.paddle.x + this.paddle.width/2, this.paddle.y, BALL_SPEED)];
  this.bricks = [];
  this.pickup;
  this.pickup_active;
  this.amount_bricks;
  this.score = 0;
  var hit_paddle = false;
  var pickup_floating = false;
  var lifes_svg;
  var score_svg;

  this.initLevel = function(level) {
    var brick_x = 0;
    var brick_y;
    var column = 0;
    var row = 0;
    this.amount_bricks = 0;
    switch (level) {
      case 1: brick_y = 50;
              for (i = 0; i < BRICKS_LVL1; i++) {
                if (row === 0) {
                  this.bricks[i] = new Brick(brick_x, brick_y, 2);
                }
                else {
                  this.bricks[i] = new Brick(brick_x, brick_y, 1);
                }
                this.amount_bricks++;
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else{
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 2: var column_limit = 1;
              brick_y = 15;
              for (i = 0; i < BRICKS_LVL2; i++) {
                if (row == 12){
                  if (column == 12){
                    this.bricks[i] = new Brick(brick_x, brick_y, 1);
                  }
                  else {
                    this.bricks[i] = new Brick(brick_x, brick_y, 2);
                  }
                }
                else {
                  this.bricks[i] = new Brick(brick_x, brick_y, 1);
                }
                this.amount_bricks++;
                column++;
                if (column == column_limit){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  column_limit++;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 3: brick_y = BRICK_PADDING_Y;
              var first = true;
              var count = 0;
              for (i = 0; i < BRICKS_LVL3; i++) {
                if ( ((row % 2) !== 0) && (row != 7) ) {
                  if ( (column >= 0) && (column < 3) ) {
                    if (first && (count < 3)) {
                      this.bricks[i] = new Brick(brick_x, brick_y, 1);
                      this.amount_bricks++;
                      count++;
                    }
                    else {
                      this.bricks[i] = new Brick(brick_x, brick_y, 0);
                    }
                  }
                  else {
                    if ( (column > 9) && (column < 13) ) {
                      if (!first && (count < 3)) {
                        this.bricks[i] = new Brick(brick_x, brick_y, 1);
                        this.amount_bricks++;
                        count++;
                      }
                      else {
                        this.bricks[i] = new Brick(brick_x, brick_y, 0);
                      }
                    }
                    else {
                      this.bricks[i] = new Brick(brick_x, brick_y, 0);
                    }
                  }
                }
                else {
                  this.bricks[i] = new Brick(brick_x, brick_y, 1);
                  this.amount_bricks++;
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT + BRICK_PADDING_Y;
                  column = 0;
                  row++;
                  if (count == 3) {
                    count = 0;
                    if (first) {
                      first = false;
                    }
                    else {
                      first = true;
                    }
                  }
                }
                else{
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 4: brick_y = BRICK_PADDING_Y;
              j = 0;
              for (i = 0; i < BRICKS_LVL4; i++) {
                if ( (row === 0) || (row == 10) ) {
                  if ( (column > 0) && (column < 12)){
                    this.bricks[j] = new Brick(brick_x, brick_y, 2);
                    this.amount_bricks++;
                    j++;
                  }
                }
                else {
                  if ( (row == 1) || (row == 9) ) {
                    if ( (column == 1) || (column == 11)){
                      this.bricks[j] = new Brick(brick_x, brick_y, 2);
                      this.amount_bricks++;
                      j++;
                    }
                  }
                  else {
                    if ( (row == 2) || (row == 8) ) {
                      if ( (column !== 0) && (column != 2) && (column != 10) && (column != 12)){
                        this.bricks[j] = new Brick(brick_x, brick_y, 2);
                        this.amount_bricks++;
                        j++;
                      }
                    }
                    else {
                      if ( (row == 3) || (row == 7) ) {
                        if ( (column == 1) || (column == 3) || (column == 9) || (column == 11)){
                          this.bricks[j] = new Brick(brick_x, brick_y, 2);
                          this.amount_bricks++;
                          j++;
                        }
                      }
                      else {
                        if ( (row == 4) || (row == 6) ) {
                          if ( (column !== 0) && (column != 2) && (column != 4) && (column != 8) && (column != 10) && (column != 12)){
                            this.bricks[j] = new Brick(brick_x, brick_y, 2);
                            this.amount_bricks++;
                            j++;
                          }
                        }
                        else {
                          if (row == 5) {
                            if ( (column !== 0) && (column != 2) && (column != 4) && (column != 6) && (column != 8) && (column != 10) && (column != 12)){
                              this.bricks[j] = new Brick(brick_x, brick_y, 2);
                              this.amount_bricks++;
                              j++;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 5: brick_y = BRICK_PADDING_Y;
              for (i = 0; i < BRICKS_LVL5; i++) {
                if (row == 5){
                  if ( (column > 2) && (column < 10)){
                    this.bricks[i] = new Brick(brick_x, brick_y, 0);
                  }
                  else {
                    this.bricks[i] = new Brick(brick_x, brick_y, 1);
                    this.amount_bricks++;
                  }
                }
                else {
                  if ( (row === 0) || (row == 10) ){
                    this.bricks[i] = new Brick(brick_x, brick_y, 2);
                    this.amount_bricks++;
                  }
                  else {
                    this.bricks[i] = new Brick(brick_x, brick_y, 1);
                    this.amount_bricks++;
                  }
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;
    }
    for(i = 0; i < this.bricks.length; i++) {
      this.bricks[i].init(this.container);
    }
  };

  this.updateScore = function () {
    if (score_svg != null) {
      score_svg.remove();
    }
    score_svg = this.container.text(3, this.viewbox.height - 5, "Score: " + this.score);
    score_svg.addClass('lifescore');
  };

  this.updateLifes = function () {
    if (lifes_svg != null) {
      lifes_svg.remove();
    }
    lifes_svg = this.container.text(this.viewbox.width - 50, this.viewbox.height - 5, "Lifes: " + this.lifes);
    lifes_svg.addClass('lifescore');
  };

  this.init = function () {
    this.paddle.init(this.container);
    this.balls[0].init(this.container);
    this.updateLifes();
    this.updateScore();
  };

  this.resetPosition = function() {
    this.paddle.remove();
    this.paddle = new Paddle(this.viewbox);
    this.paddle.init(this.container);
    if (this.pickup_active != null) {
      this.pickup_active.endEffect(this.balls, this.paddle);
      this.pickup_active.removeMessage();
    }
    this.pickup_active = null;
    if (pickup_floating) {
      this.pickup.remove();
      this.pickup = null;
      pickup_floating = false;
    }
    this.balls[0].remove();
    this.balls = [new Ball(this.paddle.x + this.paddle.width/2, this.paddle.y, BALL_SPEED)];
    this.balls[0].init(this.container);
    this.updateLifes();
  };

  this.resetBricks = function() {
    for(i = 0; i < this.bricks.length; i++) {
      if (this.bricks[i].type === 0) {
        this.bricks[i].remove();
      }
    }
  };

  this.checkLoseLife = function() {
    var flag = true;
    for (i = 0; i < this.balls.length; i++) {
      if (!this.balls[i].touch_bottom) {
        flag = false;
      }
    }
    if (flag) {
      return true;
    }
    else {
      return false;
    }
  };

  this.checkWinLevel = function()  {
    if (this.amount_bricks === 0) {
      return true;
    }
    else {
      return false;
    }
  };

  this.addPickUp = function(brick_pickup) {
    var rnd;
    if (!pickup_floating) {
      if (this.pickup_active != null) {
        if ( ((this.pickup_active.type != "A") && (brick_pickup.type != this.pickup_active.type)) || (this.pickup_active.ended) ) {
          this.pickup = brick_pickup;
        }
      }
      else {
        this.pickup = brick_pickup;
      }
      this.pickup.init(this.container);
      pickup_floating = true;
    }
  };

  this.collisionBall = function() {
    for (j = 0; j < this.balls.length; j++) {
      var ball_y = this.balls[j].cy - this.balls[j].radius + this.balls[j].speed_y;
      var ball_y2 = this.balls[j].cy + this.balls[j].radius + this.balls[j].speed_y;
      var ball_x = this.balls[j].cx - this.balls[j].radius + this.balls[j].speed_x;
      var ball_x2 = this.balls[j].cx + this.balls[j].radius + this.balls[j].speed_x;
      var ball_x_relative = this.balls[j].cx - this.paddle.x;
      //Colision con la barrera del Paddle.
      if(this.paddle.isBarrierActive()) {
        if (ball_y2 > this.paddle.y + this.paddle.height) {
          this.balls[j].speed_y = -this.balls[j].speed_y;
        }
      }
      //Colision con el Paddle.
      //Colision con la parte superior del Paddle.
      if (!hit_paddle){
        if (ball_y2 > this.paddle.y) {
          if ((this.balls[j].cx > this.paddle.x) && (this.balls[j].cx < this.paddle.x + this.paddle.width) && (this.balls[j].cy < this.paddle.y)){
            if ((this.balls[j].cx > this.paddle.x) && (this.balls[j].cx < this.paddle.x + (this.paddle.width / 2)) && (this.balls[j].speed_x > 0)) {
              this.balls[j].speed_x = -this.balls[j].speed_x;
            }
            else {
              if ((this.balls[j].cx > this.paddle.x + (this.paddle.width / 2)) && (this.balls[j].cx < this.paddle.x + this.paddle.width) && (this.balls[j].speed_x < 0)) {
                this.balls[j].speed_x = -this.balls[j].speed_x;
              }
            }
            // DIrección Y de la pelota dependiendo en donde toca el paddle.
            if ( (ball_x_relative > this.paddle.width * 0.4) && (ball_x_relative < this.paddle.width * 0.6) ) {
              this.balls[j].speed_y = -this.balls[j].total_speed * 1.2;
              if (this.balls[j].speed_x < 0){
                this.balls[j].speed_x = -this.balls[j].total_speed * 0.5;
              }
              else {
                this.balls[j].speed_x = this.balls[j].total_speed * 0.5;
              }
            }
            else {
              if ( (ball_x_relative > this.paddle.width * 0.10) && (ball_x_relative < this.paddle.width * 0.90) ) {
                this.balls[j].speed_y = -this.balls[j].total_speed;
                if (this.balls[j].speed_x < 0) {
                  this.balls[j].speed_x = -this.balls[j].total_speed;
                }
                else {
                  this.balls[j].speed_x = this.balls[j].total_speed;
                }
              }
              else{
                this.balls[j].speed_y = -this.balls[j].total_speed * 0.7;
                if (this.balls[j].speed_x < 0) {
                  this.balls[j].speed_x = -this.balls[j].total_speed * 1.5;
                }
                else {
                  this.balls[j].speed_x = this.balls[j].total_speed * 1.5;
                }
              }
            }
            hit_paddle = true;
          }
          //Colision con los costados del Paddle.
          if ( (this.balls[j].cy > this.paddle.y) && (this.balls[j].cy < this.paddle.y + this.paddle.height) ) {
            if( (this.balls[j].cx > this.paddle.x) && (this.balls[j].cx < this.paddle.x + this.paddle.width) ){
              this.balls[j].speed_x = -this.balls[j].speed_x;
              this.balls[j].speed_y = -this.balls[j].total_speed * 0.7;
              if (this.balls[j].speed_x < 0) {
                this.balls[j].speed_x = -this.balls[j].total_speed * 1.5;
              }
              else {
                this.balls[j].speed_x = this.balls[j].total_speed * 1.5;
              }
              hit_paddle = true;
            }
          }
        }
      }
      if (ball_y2 < this.paddle.y) {
        hit_paddle = false;
      }
      //Colision con los Bricks.
      for(i = 0; i < this.bricks.length; i++) {
        var remove_brick = false;
        var hit_brick = false;
        if( (this.bricks[i].hits > 0) || (this.bricks[i].type === 0) ) {
          //Colision con la parte superior e inferior.
          if ( ((ball_y < this.bricks[i].y + this.bricks[i].height) && (ball_y > this.bricks[i].y)) || ((ball_y2 < this.bricks[i].y + this.bricks[i].height) && (ball_y2 > this.bricks[i].y)) ) {
            if ( (this.balls[j].cx > this.bricks[i].x) && (this.balls[j].cx < this.bricks[i].x + this.bricks[i].width) ){
              this.balls[j].speed_y = -this.balls[j].speed_y;
              this.bricks[i].hit(this.container);
              if ( (this.bricks[i].type !== 0) && this.bricks[i].hits === 0) {
                remove_brick = true;
              }
              hit_brick = true;
            }
          }
          //Colision con los costados.
          if ( ((ball_x < this.bricks[i].x + this.bricks[i].width) && (ball_x > this.bricks[i].x)) || ((ball_x2 < this.bricks[i].x + this.bricks[i].width) && (ball_x2 > this.bricks[i].x)) ) {
            if ( (this.balls[j].cy > this.bricks[i].y) && (this.balls[j].cy < this.bricks[i].y + this.bricks[i].height) ){
              if(!hit_brick){
                this.balls[j].speed_x = -this.balls[j].speed_x;
                this.bricks[i].hit(this.container);
                if ( (this.bricks[i].type !== 0) && this.bricks[i].hits === 0) {
                  remove_brick = true;
                }
              }
            }
          }
        }
        if (remove_brick) {
          this.amount_bricks--;
          this.score = this.score + this.bricks[i].score;
          this.updateScore();
          if (this.bricks[i].pickup != null) {
            this.addPickUp(this.bricks[i].pickup);
          }
        }
      }
    }
  };

  this.collisionPickUp = function() {
    if (pickup_floating) {
      var pickup_y = this.pickup.y;
      var pickup_y2 = this.pickup.y + this.pickup.height;
      var pickup_x = this.pickup.x;
      var pickup_x2 = this.pickup.x + this.pickup.width;
      if ( (pickup_y2 > this.paddle.y) && (pickup_y < (this.paddle.y + this.paddle.height)) ) {
        if ( ((pickup_x > this.paddle.x) && (pickup_x < this.paddle.x + this.paddle.width)) || ((pickup_x2 < this.paddle.x + this.paddle.width) && (pickup_x2 > this.paddle.x)) ) {
          this.pickup.touch_bottom = true;
          pickup_floating = false;
          if (this.pickup_active != null) {
            this.pickup_active.endEffect(this.balls, this.paddle);
          }
          this.score = this.score + this.pickup.score;
          this.updateScore();
          this.pickup_active = this.pickup;
        }
      }
    }
  };

  this.collisionBullets = function() {
    for (i = 0; i < this.paddle.bullets.length; i++) {
      var bullet_y = this.paddle.bullets[i].y - this.paddle.bullets[i].speed;
      var bullet_x = this.paddle.bullets[i].x;
      var bullet_x2 = this.paddle.bullets[i].x + this.paddle.bullets[i].width;
      if (!this.paddle.bullets[i].collision) {
        for (j = 0; j < this.bricks.length; j++) {
          var remove_brick = false;
          var brick_y2 = this.bricks[j].y + this.bricks[j].height;
          var brick_x = this.bricks[j].x;
          var brick_x2 = this.bricks[j].x + this.bricks[j].width;
          if( (this.bricks[j].hits > 0) || (this.bricks[j].type === 0) ) {
            if (bullet_y < brick_y2) {
              if ( ((bullet_x > brick_x) && (bullet_x < brick_x2)) || ((bullet_x2 > brick_x) && (bullet_x2 < brick_x2)) ) {
                this.paddle.bullets[i].hit();
                this.bricks[j].hit(this.container);
                if ( (this.bricks[j].type !== 0) && this.bricks[j].hits === 0) {
                  remove_brick = true;
                }
              }
            }
          }
          if (remove_brick) {
            this.amount_bricks--;
            this.score = this.score + this.bricks[i].score;
            this.updateScore();
            if (this.bricks[j].pickup != null) {
              this.addPickUp(this.bricks[j].pickup);
            }
          }
        }
      }
    }
  };

  this.update = function() {
    for(i = 0; i < this.balls.length; i++) {
      this.balls[i].update(this.paddle, this.viewbox);
    }
    this.paddle.update(this.container, this.viewbox);
    if (this.pickup != null){
      if (this.pickup.touch_bottom) {
        pickup_floating = false;
      }
      this.pickup.update(this.viewbox);
    }
    this.collisionBall();
    this.collisionPickUp();
    this.collisionBullets();
    if (this.pickup_active != null){
      this.pickup_active.effect(this);
      if (this.pickup_active.type == "A") {
        this.pickup_active.endEffect(this.balls, this.paddle);
      }
    }
  };

  this.draw = function() {
    this.paddle.draw();
    for(i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
    }
    for (i = 0; i < this.bricks.length; i ++) {
      this.bricks[i].draw();
    }
    if (this.pickup != null) {
      this.pickup.draw();
    }
  };

}

//Clase Principal del juego.
function Arkanoid() {

  var LIMIT_LEVEL = 5;
  var LEVEL_TIMER = 2000;
  var GAMEOVER_HEIGHT = 120;

  var container = Snap("#container");
  var viewbox = container.attr('viewBox');
  var player = new Player (3, container);
  var level = 1;
  var game_started = false;
  var level_started = false;
  var background_start_svg;
  var controls_svg;
  var background_level_svg;
  var level_svg;
  var submit_score_svg;
  var yes_svg;
  var no_svg;

  function levelTransition() {
    background_level_svg = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background_level_svg.addClass('backgroundlevel');
    level_svg = container.text(viewbox.width/2-35, viewbox.height/2, "Level " + level);
    level_svg.addClass('levelmessage');
    setTimeout(function(){
      level_started = true;
      background_level_svg.remove();
      level_svg.remove();
    }, LEVEL_TIMER);
  }

  function checkPlayerLoseLife() {
    if (player.checkLoseLife()) {
      player.lifes--;
      if (player.lifes > 0) {
        player.resetPosition();
      }
    }
  }

  function checkPlayerWinLevel() {
    if (player.checkWinLevel()) {
      level++;
      if (level <= LIMIT_LEVEL) {
        level_started = false;
        player.resetPosition();
        player.resetBricks();
        player.initLevel(level);
        levelTransition();
      }
    }
  }

  function update() {
    player.update();
  }

  function draw() {
    player.draw();
  }

  this.checkGameOver = function() {
    if (player.lifes === 0) {
      var lose1_svg = container.rect(0, viewbox.height/2 -75, container.attr('width'), GAMEOVER_HEIGHT);
      var lose2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 - 50, "You Lose!");
      var score_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 25, "Score: " + player.score);
      submit_score_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 10, "Submit Score?");
      yes_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 + 35, "Yes");
      no_svg = container.text(viewbox.width/2 + 15, viewbox.height/2 + 35, "No");
      lose1_svg.addClass('lose');
      lose2_svg.addClass('levelmessage');
      score_svg.addClass('levelmessage');
      submit_score_svg.addClass('levelmessage');
      yes_svg.addClass('levelmessage');
      no_svg.addClass('levelmessage');
      yes_svg.attr({
        id: 'yes'
      });
      no_svg.attr({
        id: 'no'
      });
      return true;
    }
    else {
      if (level > LIMIT_LEVEL) {
        var win1_svg = container.rect(0, viewbox.height/2 -75, container.attr('width'), GAMEOVER_HEIGHT);
        var win2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 - 50, "You Win!");
        var score_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 25, "Score: " + player.score);
        submit_score_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 10, "Submit Score?");
        yes_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 + 35, "Yes");
        no_svg = container.text(viewbox.width/2 + 15, viewbox.height/2 + 35, "No");
        win1_svg.addClass('win');
        win2_svg.addClass('levelmessage');
        score_svg.addClass('levelmessage');
        submit_score_svg.addClass('levelmessage');
        yes_svg.addClass('levelmessage');
        no_svg.addClass('levelmessage');
        yes_svg.attr({
          id: 'yes'
        });
        no_svg.attr({
          id: 'no'
        });
        return true;
      }
      else {
        return false;
      }
    }
  };

  this.checkSubmit = function(confirm) {
    submit_score_svg.remove();
    yes_svg.remove();
    no_svg.remove();
    var ty_playing_svg;
    if (confirm == "Y") {
      var submitted_svg = container.text(viewbox.width/2 - 60, viewbox.height/2 + 10, "Score Submitted");
      ty_playing_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 30, "Thank you for Playing!");
      submitted_svg.addClass('levelmessage');
    }
    else {
      ty_playing_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 10, "Thank you for Playing!");
    }
    ty_playing_svg.addClass('levelmessage');
  };

  this.sendScore = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/submit_score.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var self = this;
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        self.checkSubmit("Y");
      }
    };
    xhr.send("score=" + player.score);
  };

  this.init = function() {
    var background = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background.addClass('backgroundlevel');
    player.init();
    player.initLevel(level);
    background_start_svg = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background_start_svg.addClass('backgroundlevel');
    var controls1_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 50, "Controls:");
    var controls2_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 - 25, "Z: Move Left");
    var controls3_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 - 5, "X: Move Right");
    var controls4_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 15, "S: Shoot");
    var controls5_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 100, "Press \"Space\" to Start.");
    controls1_svg.addClass('levelmessage');
    controls2_svg.addClass('levelmessage');
    controls3_svg.addClass('levelmessage');
    controls4_svg.addClass('levelmessage');
    controls5_svg.addClass('levelmessage');
    controls_svg = container.g(controls1_svg, controls2_svg, controls3_svg, controls4_svg, controls5_svg);
  };

  this.run = function() {
    if (game_started) {
      if (level_started) {
        update();
        draw();
        checkPlayerLoseLife();
        checkPlayerWinLevel();
      }
    }
    else {
      if (Key.isDown(Key.START)) {
        game_started = true;
        background_start_svg.remove();
        controls_svg.remove();
        levelTransition();
      }
    }
  };

}

//Main.
$(document).ready(function() {
  var elementExists = document.getElementById("container");
  if (elementExists != null) {
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

    $('svg').on("click", '#yes', function() {
      game.sendScore();
    });

    $('svg').on("click", '#no', function() {
      game.checkSubmit("N");
    });
  }
});
