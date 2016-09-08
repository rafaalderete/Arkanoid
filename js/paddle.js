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
  this.can_move = true;
  var bullet_sound = new Audio('./resources/sounds/bullet.wav');
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

  //Dibuja el SVG.
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

  //Agrega las balas y las dibuja.
  this.shoot = function (container) {
    if (cannon_form && can_shoot) {
      var bullet1 = new Bullet (this.x + 15, this.y - 3);
      var bullet2 = new Bullet (this.x + this.width - 20, this.y - 3);
      bullet_sound.cloneNode(true).play();
      bullet1.init(container);
      bullet2.init(container);
      this.bullets.push(bullet1);
      this.bullets.push(bullet2);
      can_shoot = false;
      setTimeout(function(){ //Timer entre cada disparo.
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

  this.update = function (id, container, viewbox) {
    if (this.can_move) {
      if (id === 0) {
        if (Key.isDown(Key.LEFT1)){
          this.moveLeft();
        }
        if (Key.isDown(Key.RIGHT1)){
          this.moveRight(viewbox);
        }
        if (Key.isDown(Key.SHOOT)) {
          this.shoot(container);
        }
      }
      else {
        if (Key.isDown(Key.LEFT2)){
          this.moveLeft();
        }
        if (Key.isDown(Key.RIGHT2)){
          this.moveRight(viewbox);
        }
      }
    }
    for (i = 0; i < this.bullets.length; i++) {
      this.bullets[i].update(viewbox);
    }
  };

  //Actualiza la posición del SVG.
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
