function Player (gamemode, id, lifes, container) {

  this.BALL_SPEED = 2.5;

  this.container = container;
  this.viewbox = this.container.attr('viewBox');
  this.id = id;
  this.lifes = lifes;
  this.paddle = new Paddle(this.viewbox);
  this.balls = [new Ball(this.paddle.x + this.paddle.width/2, this.paddle.y, this.BALL_SPEED)];
  this.level;
  this.ball_sync = false;
  this.pickup;
  this.pickup_active;
  this.score = 0;
  this.padddle_sound = new Audio('./resources/sounds/paddle.wav');
  this.brick1_sound = new Audio('./resources/sounds/brick1.wav');
  this.brick2_sound = new Audio('./resources/sounds/brick2.wav');
  this.pickup_sound = new Audio('./resources/sounds/pickup.wav');
  this.hit_paddle = false;
  this.pickup_floating = false;
  this.pickup_blocked = false;
  this.lifes_svg;
  this.score_svg;

  this.initLevel = function(level) {
    this.level.initLevel(this.container, this.id, level);
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
    if (this.level.amount_bricks === 0) {
      return true;
    }
    else {
      return false;
    }
  };

  this.addPickUp = function(brick_pickup) {
    var rnd;
    if (!this.pickup_floating) {
      if (this.pickup_active != null) {
        //Sola agrega el pickup, si su efecto terminó, si es distinto al brick actual o si el actual es distinto al pickup tipo A.
        if ( ((this.pickup_active.type != "A") && (brick_pickup.type != this.pickup_active.type)) || (this.pickup_active.ended) ) {
          this.pickup = brick_pickup;
        }
      }
      else {
        this.pickup = brick_pickup;
      }
      this.pickup.init(this.container);
      this.pickup_floating = true;
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
          this.padddle_sound.cloneNode(true).play();
        }
      }
      //Colision con el Paddle.
      //Colision con la parte superior del Paddle.
      if (!this.hit_paddle){
        if (ball_y2 > this.paddle.y) {
          if ((this.balls[j].cx > this.paddle.x) && (this.balls[j].cx < this.paddle.x + this.paddle.width) && (this.balls[j].cy < this.paddle.y)){
            this.padddle_sound.cloneNode(true).play();
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
            this.hit_paddle = true;
          }
          //Colision con los costados del Paddle.
          if ( (this.balls[j].cy > this.paddle.y) && (this.balls[j].cy < this.paddle.y + this.paddle.height) ) {
            if( (this.balls[j].cx > this.paddle.x) && (this.balls[j].cx < this.paddle.x + this.paddle.width) ){
              this.padddle_sound.cloneNode(true).play();
              this.balls[j].speed_x = -this.balls[j].speed_x;
              this.balls[j].speed_y = -this.balls[j].total_speed * 0.7;
              if (this.balls[j].speed_x < 0) {
                this.balls[j].speed_x = -this.balls[j].total_speed * 1.5;
              }
              else {
                this.balls[j].speed_x = this.balls[j].total_speed * 1.5;
              }
              this.hit_paddle = true;
            }
          }
        }
      }
      if (ball_y2 < this.paddle.y) {
        this.hit_paddle = false;
      }
      //Colision con los Bricks.
      for(i = 0; i < this.level.bricks.length; i++) {
        var remove_brick = false;
        var hit_brick = false;
        if( (this.level.bricks[i].hits > 0) || (this.level.bricks[i].type === 0) ) {
          //Colision con la parte superior e inferior.
          if ( ((ball_y < this.level.bricks[i].y + this.level.bricks[i].height) && (ball_y > this.level.bricks[i].y)) || ((ball_y2 < this.level.bricks[i].y + this.level.bricks[i].height) && (ball_y2 > this.level.bricks[i].y)) ) {
            if ( (this.balls[j].cx > this.level.bricks[i].x) && (this.balls[j].cx < this.level.bricks[i].x + this.level.bricks[i].width) ){
              this.balls[j].speed_y = -this.balls[j].speed_y;
              this.level.bricks[i].hit(this.container);
              if (this.level.bricks[i].type == 1) {
                this.brick1_sound.cloneNode(true).play();
              }
              else {
                this.brick2_sound.cloneNode(true).play();
              }
              if ( (this.level.bricks[i].type !== 0) && this.level.bricks[i].hits === 0) {
                remove_brick = true;
              }
              hit_brick = true;
            }
          }
          //Colision con los costados.
          if ( ((ball_x < this.level.bricks[i].x + this.level.bricks[i].width) && (ball_x > this.level.bricks[i].x)) || ((ball_x2 < this.level.bricks[i].x + this.level.bricks[i].width) && (ball_x2 > this.level.bricks[i].x)) ) {
            if ( (this.balls[j].cy > this.level.bricks[i].y) && (this.balls[j].cy < this.level.bricks[i].y + this.level.bricks[i].height) ){
              if(!hit_brick){
                this.balls[j].speed_x = -this.balls[j].speed_x;
                this.level.bricks[i].hit(this.container);
                if (this.level.bricks[i].type == 1) {
                  this.brick1_sound.cloneNode(true).play();
                }
                else {
                  this.brick2_sound.cloneNode(true).play();
                }
                if ( (this.level.bricks[i].type !== 0) && this.level.bricks[i].hits === 0) {
                  remove_brick = true;
                }
              }
            }
          }
        }
        if (remove_brick) {
          this.removeBrick(this.level.bricks[i]);
        }
      }
    }
  };

  //Colisión de las balas con los bricks.
  this.collisionBullets = function() {
    for (i = 0; i < this.paddle.bullets.length; i++) {
      var bullet_y = this.paddle.bullets[i].y - this.paddle.bullets[i].speed;
      var bullet_x = this.paddle.bullets[i].x;
      var bullet_x2 = this.paddle.bullets[i].x + this.paddle.bullets[i].width;
      if (!this.paddle.bullets[i].collision) {
        for (j = 0; j < this.level.bricks.length; j++) {
          var remove_brick = false;
          var brick_y2 = this.level.bricks[j].y + this.level.bricks[j].height;
          var brick_x = this.level.bricks[j].x;
          var brick_x2 = this.level.bricks[j].x + this.level.bricks[j].width;
          if( (this.level.bricks[j].hits > 0) || (this.level.bricks[j].type === 0) ) {
            if (bullet_y < brick_y2) {
              if ( ((bullet_x > brick_x) && (bullet_x < brick_x2)) || ((bullet_x2 > brick_x) && (bullet_x2 < brick_x2)) ) {
                this.paddle.bullets[i].hit();
                this.level.bricks[j].hit(this.container);
                if ( (this.level.bricks[j].type !== 0) && this.level.bricks[j].hits === 0) {
                  remove_brick = true;
                }
              }
            }
          }
          if (remove_brick) {
            this.removeBrick(this.level.bricks[j]);
          }
        }
      }
    }
  };

  this.update = function(rival) {
    for(i = 0; i < this.balls.length; i++) {
      this.balls[i].update(this.paddle, this.viewbox);
    }
    this.paddle.update(this.id, this.container, this.viewbox);
    if (this.pickup != null){
      if (this.pickup.touch_bottom) {
        this.pickup_floating = false;
      }
      this.pickup.update(this.viewbox);
    }
    this.collisionBall();
    this.collisionPickUp(rival);
    this.collisionBullets();
    if (this.pickup_active != null){
      this.pickup_active.effect(this, rival);
      if (this.pickup_active.type == "A") {
        this.pickup_active.endEffect(this.balls, this.paddle, rival);
      }
    }
  };

  this.draw = function() {
    this.paddle.draw();
    for(i = 0; i < this.balls.length; i++) {
      this.balls[i].draw();
    }
    for (i = 0; i < this.level.bricks.length; i ++) {
      this.level.bricks[i].draw();
    }
    if (this.pickup != null) {
      this.pickup.draw();
    }
  };

}
