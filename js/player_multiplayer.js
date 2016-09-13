function PlayerMultiPlayer (gamemode, id, lifes, container) {

  Player.call(this, gamemode, id, lifes, container);
  this.level = new Level(gamemode);

  this.init = function () {
    this.paddle.init(this.container);
    this.balls[0].init(this.container);
  };

  this.removeBrick = function(brick) {
      this.level.amount_bricks--;
      if (brick.pickup != null) {
        this.addPickUp(brick.pickup);
      }
  };

  //Colisión del pickup con el paddle.
  this.collisionPickUp = function(rival) {
    if (this.pickup_floating && !this.pickup_blocked) {
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
            this.pickup_active.endEffect(this.balls, this.paddle, rival);
          }
          this.pickup_active = this.pickup;
        }
      }
    }
  };

}

PlayerMultiPlayer.prototype = Object.create(Player.prototype);
