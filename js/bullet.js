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

  //Dibuja el SVG.
  this.init = function (container) {
    bullet_svg = container.rect(this.x, this.y, this.width, this.height, 10, 10);
    bullet_svg.addClass('bullet');
  };

  //Actualiza la posición y chequea colisión con la parte superior del viewbox.
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

  //Elimina el SVG si colisionó.
  this.draw = function() {
    if (this.collision) {
      bullet_svg.remove();
    }
    else {
      bullet_svg.attr({y:this.y});
    }
  };

}
