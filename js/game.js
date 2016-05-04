//Controles.
var Key = {
  _pressed: {},

  LEFT: 37,
  RIGHT: 39,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

function Paddle(viewbox) {

  var PADDLE_WIDTH = 60;
	var PADDLE_HEIGHT = 10;
  var PADDLE_BORDER_WIDTH = 10;
  var PADDLE_SPEED = 7;

	this.width = PADDLE_WIDTH + PADDLE_BORDER_WIDTH * 2;
  this.height = PADDLE_HEIGHT;
  this.x = (viewbox.width - this.width) / 2;
  this.y = viewbox.height - PADDLE_HEIGHT - 20;

  this.init = function (container) {
    var left_border_svg = container.rect(this.x, this.y, PADDLE_BORDER_WIDTH, PADDLE_HEIGHT);
    var center_paddle_svg = container.rect(PADDLE_BORDER_WIDTH + this.x, this.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    var right_border_svg = container.rect(PADDLE_BORDER_WIDTH + PADDLE_WIDTH + this.x, this.y, PADDLE_BORDER_WIDTH, PADDLE_HEIGHT);
    center_paddle_svg.attr({
      fill: 'gray',
      id: 'c_paddle'
    });
    left_border_svg.attr({
      fill: 'red',
      id: 'lb_paddle'
    });
    right_border_svg.attr({
      fill: 'red',
      id: 'rb_paddle'
    });
  }

  this.moveRight = function(viewbox) {
    if ((this.x + PADDLE_WIDTH + PADDLE_BORDER_WIDTH * 2 + PADDLE_SPEED) < viewbox.width) {
      this.x = this.x + PADDLE_SPEED;
    }
  }

  this.moveLeft = function() {
    if( (this.x - PADDLE_SPEED) > 0) {
      this.x = this.x - PADDLE_SPEED;
    }
  }

  this.update = function (viewbox) {
    if (Key.isDown(Key.LEFT)) this.moveLeft();
    if (Key.isDown(Key.RIGHT)) this.moveRight(viewbox);
  }

  this.draw = function() {
    var left = document.getElementById("lb_paddle");
    var center = document.getElementById("c_paddle");
    var right = document.getElementById("rb_paddle");
    left.setAttribute("x", this.x);
    center.setAttribute("x", PADDLE_BORDER_WIDTH + this.x);
    right.setAttribute("x", PADDLE_BORDER_WIDTH + PADDLE_WIDTH + this.x);
  }

};

function Ball(cx,cy) {

  var INICIAL_X = 400;
  var INICIAL_Y = 400;
  var BALL_RADIUS = 4;
  var BALL_SPEED = 3;
  var INCREMENT_SPEED = 0.1;
  var INCREMENT_TIME = 5000;

	this.cx = cx;
	this.cy = cy - BALL_RADIUS;
	this.radius = BALL_RADIUS;
	this.speed_x = BALL_SPEED;
  this.speed_y = -BALL_SPEED;
  var touch_bottom = false;
  var speed_timer;

  this.increaseSpeed = function() {
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
  }

  this.init = function(container) {
    var ball_svg = container.circle(this.cx, this.cy, this.radius);
    ball_svg.attr({
      fill: 'white',
      id: 'ball',
      stroke: "red",
      strokeWidth: 1
    });
    var self = this;
    speed_timer = setInterval(function() {
      self.increaseSpeed();
    }, INCREMENT_TIME);
  }

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
  }

  this.draw = function() {
    var ball = document.getElementById("ball");
    ball.setAttribute("cx", this.cx);
    ball.setAttribute("cy", this.cy);
  }

}

function Brick(x, y, hits) {

  var BRICK_WIDTH = 50;
  var BRICK_HEIGHT = 15;

	this.x = x;
	this.y = y;
  this.width = BRICK_WIDTH;
  this.height = BRICK_HEIGHT;
  this.hits = hits;
  var brick_svg;

  this.init = function(container) {
    this.brick_svg = container.rect(this.x, this.y, BRICK_WIDTH, BRICK_HEIGHT);
    this.brick_svg.attr({
      fill: 'white'
    });
  }

  this.draw = function() {
    if(this.hits == 0) {
      this.brick_svg.remove();
    }
  }

}


//Clase Principal del juego.
function Arkanoid() {

  var BRICK_WIDTH = 50;
  var BRICK_HEIGHT = 15;
  var BRICK_PADDING = 5;
  var BRICK_OFFSET_X = 25;
  var BRICK_OFFSET_Y = 20;

  var container = Snap("#container");
  var viewbox = container.attr('viewBox');
  var level = 1;
  var lifes = 1;
  var paddle = new Paddle(viewbox);
  var ball = new Ball(paddle.x + paddle.width/2, paddle.y);
  var bricks = [];
  var amount_bricks = 0;
  var hit_paddle = false;

  this.initLevel = function() {
    var brick_x = BRICK_OFFSET_X ;
    var brick_y = BRICK_OFFSET_Y;
    for(i = 0; i < 7; i++) {
      bricks[i] = [];
      bricks[i][0] = new Brick(brick_x, brick_y, 1);
      amount_bricks++;
      brick_x = brick_x + BRICK_WIDTH + BRICK_PADDING;
      for(j = 1; j < 10; j++) {
          bricks[i][j] = new Brick(brick_x, brick_y, 1);
          amount_bricks++;
          brick_x = brick_x + BRICK_WIDTH + BRICK_PADDING;
      }
      brick_x = BRICK_OFFSET_X;
      brick_y = brick_y + BRICK_HEIGHT + BRICK_PADDING;
    }
  }

  this.checkGameOver = function() {
    if (ball.touch_bottom) {
      var text = container.text(viewbox.width/2-35, viewbox.height/2, "You Lose!");
      text.attr({
        fill: 'white',
        "font-size": "20px"
      });
      return true;
    }
    else {
      if (amount_bricks == 0) {
        var text = container.text(viewbox.width/2-35, viewbox.height/2, "You Win!");
        text.attr({
          fill: 'white',
          "font-size": "20px"
        });
        return true;
      }
      else {
        return false;
      }
    }
  }

  this.collisionDetection = function() {
    var ball_y = ball.cy - ball.radius;
    var ball_y2 = ball.cy + ball.radius;
    var ball_x = ball.cx - ball.radius;
    var ball_x2 = ball.cx + ball.radius;
    var hit_brick;
    //Colision con el Paddle.
    //Colision con la parte superior del Paddle.
    if (!hit_paddle){
      if (ball_y2 > paddle.y) {
        if ((ball.cx > paddle.x) && (ball.cx < paddle.x + paddle.width) && (ball.cy < paddle.y)){
          if ((ball.cx > paddle.x) && (ball.cx < paddle.x + (paddle.width / 2)) && (ball.speed_x > 0)) {
            ball.speed_x = -ball.speed_x;
          }
          else {
            if ((ball.cx > paddle.x + (paddle.width / 2)) && (ball.cx < paddle.x + paddle.width) && (ball.speed_x < 0)) {
              ball.speed_x = -ball.speed_x;
            }
          }
          ball.speed_y  = -ball.speed_y;
          hit_paddle = true;
        }
        //Colision con los costados del Paddle.
        if ((ball.cy > paddle.y) && (ball.cy < paddle.y + paddle.height)) {
          if((ball.cx > paddle.x) && (ball.cx < paddle.x + paddle.width)){
            ball.speed_x = -ball.speed_x;
            ball.speed_y = -ball.speed_y;
            hit_paddle = true;
          }
        }
      }
    }
    if (ball_y2 < paddle.y) {
      hit_paddle = false;
    }
    //Colision con los Bricks.
    for( i = 0; i < 7; i++) {
      for(j = 0; j < 10; j++) {
        hit_brick = false;
        if(bricks[i][j].hits > 0 ) {
          //Colision con la parte superior e inferior.
          if ( ((ball_y < bricks[i][j].y + bricks[i][j].height) && (ball_y > bricks[i][j].y)) || ((ball_y2 < bricks[i][j].y + bricks[i][j].height) && (ball_y2 > bricks[i][j].y)) ) {
            if ( (ball.cx > bricks[i][j].x) && (ball.cx < bricks[i][j].x + bricks[i][j].width) ){
              ball.speed_y = -ball.speed_y;
              bricks[i][j].hits = bricks[i][j].hits - 1;
              hit_brick = true;
              amount_bricks--;
            }
          }
          //Colision con los costados.
          if ( ((ball_x < bricks[i][j].x + bricks[i][j].width) && (ball_x > bricks[i][j].x)) || ((ball_x2 < bricks[i][j].x + bricks[i][j].width) && (ball_x2 > bricks[i][j].x)) ) {
            if ( (ball.cy > bricks[i][j].y) && (ball.cy < bricks[i][j].y + bricks[i][j].height) ){
              if(!hit_brick){
                ball.speed_x = -ball.speed_x;
                bricks[i][j].hits = bricks[i][j].hits - 1;
                amount_bricks--;
              }
            }
          }
        }
      }
    }
  }

  this.init = function() {
    var background = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background.attr({
      fill: "black",
      stroke: "white",
      strokeWidth: 1
    });
    this.initLevel();
    paddle.init(container);
    ball.init(container);
    for(i = 0; i < 7; i++) {
      for(j = 0; j < 10; j++) {
        bricks[i][j].init(container);
      }
    }
  }

  this.update = function() {
    ball.update(paddle, viewbox);
    paddle.update(viewbox);
    this.collisionDetection();
  }

  this.draw = function() {
    paddle.draw();
    ball.draw();
    for(i = 0; i < 7; i++) {
      for(j = 0; j < 10; j++) {
        bricks[i][j].draw();
      }
    }
  }

  this.run = function() {
    this.update();
    this.draw();
  }

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
  }, 1000/60);

});
