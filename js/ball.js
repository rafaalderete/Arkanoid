function Ball(cx, cy, speed, multi1, multi2) {

  var BALL_RADIUS = 4;
  var BALL_SPEED = 3;
  var INCREMENT_SPEED = 0.15;
  var INCREMENT_TIME = 4000;

	this.cx = cx;
	this.cy = cy - BALL_RADIUS;
	this.radius = BALL_RADIUS;
  //Dirección inicial de las pelotas al tocar el pickup Multiball.
  if (multi1 || multi2) {
    if (multi1) {
      this.speed_x = -speed;
    }
    else {
      this.speed_x = speed;
    }
    this.speed_y = -speed * 1.2;
  }
  //Dirección inicial de la pelota principal.
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

  //Se setea el incremento de velocidad, dependiendo de la dirección actual.
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

  //Dibuja el SVG.
  this.init = function(container) {
    ball_svg = container.circle(this.cx, this.cy, this.radius);
    ball_svg.addClass('ball');
    var self = this;
    speed_timer = setInterval(function() { // Se setea el timer de incremento de velocidad.
      self.incrementSpeed();
    }, INCREMENT_TIME);
  };


  this.update = function (paddle, viewbox) {
    //Colisión con las paredes del viewbox.
    if ( (this.cx + this.radius + this.speed_x > viewbox.width) || (this.cx - this.radius + this.speed_x < 0) ) {
      this.speed_x = -this.speed_x;
    }
    if (this.cy -this.radius + this.speed_y < 0) {
      this.speed_y = -this.speed_y;
    }
    if (this.cy + this.radius > viewbox.height) {
      this.touch_bottom = true;
    }
    //Se suma el incrementocde velocidad a la velocidad actual.
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
