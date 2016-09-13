function SinglePlayer (gamemode, id, lifes, container) {

  Player.call(this, gamemode, id, lifes, container);
  this.level = new Level(gamemode);

  this.updateScore = function () {
    if (this.score_svg != null) {
      this.score_svg.remove();
    }
    this.score_svg = this.container.text(3, this.viewbox.height - 5, "Score: " + this.score);
    this.score_svg.addClass('lifescore');
  };

  this.updateLifes = function () {
    if (this.lifes_svg != null) {
      this.lifes_svg.remove();
    }
    this.lifes_svg = this.container.text(this.viewbox.width - 50, this.viewbox.height - 5, "Lifes: " + this.lifes);
    this.lifes_svg.addClass('lifescore');
  };

  this.init = function () {
    this.paddle.init(this.container);
    this.balls[0].init(this.container);
    this.updateLifes();
    this.updateScore();
  };

  //Borra todos los SVG del paddle y las bolas y los vuelve a crear en su posición original.
  this.resetPosition = function() {
    this.paddle.remove();
    this.paddle = new Paddle(this.viewbox);
    this.paddle.init(this.container);
    if (this.pickup_active != null) {
      this.pickup_active.endEffect(this.balls, this.paddle);
      this.pickup_active.removeMessage();
    }
    this.pickup_active = null;
    if (this.pickup_floating) {
      this.pickup.remove();
      this.pickup = null;
      this.pickup_floating = false;
    }
    this.balls[0].remove();
    this.balls = [new Ball(this.paddle.x + this.paddle.width/2, this.paddle.y, this.BALL_SPEED)];
    this.balls[0].init(this.container);
    this.updateLifes();
  };

  //Borra los SVG del los bricks.
  this.resetBricks = function() {
    for(i = 0; i < this.level.bricks.length; i++) {
      if (this.level.bricks[i].type === 0) {
        this.level.bricks[i].remove();
      }
    }
  };

  this.removeBrick = function(brick) {
      this.level.amount_bricks--;
      this.score = this.score + brick.score;
      this.updateScore();
      if (brick.pickup != null) {
        this.addPickUp(brick.pickup);
      }
  };

  //Colisión del pickup con el paddle.
  this.collisionPickUp = function() {
    if (this.pickup_floating) {
      var pickup_y = this.pickup.y;
      var pickup_y2 = this.pickup.y + this.pickup.height;
      var pickup_x = this.pickup.x;
      var pickup_x2 = this.pickup.x + this.pickup.width;
      if ( (pickup_y2 > this.paddle.y) && (pickup_y < (this.paddle.y + this.paddle.height)) ) {
        if ( ((pickup_x > this.paddle.x) && (pickup_x < this.paddle.x + this.paddle.width)) || ((pickup_x2 < this.paddle.x + this.paddle.width) && (pickup_x2 > this.paddle.x)) ) {
          this.pickup_sound.cloneNode(true).play();
          this.pickup.touch_bottom = true;
          this.pickup_floating = false;
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

}

SinglePlayer.prototype = Object.create(Player.prototype);
