function Brick(gamemode, id, x, y, type) {

  var BRICK_WIDTH = 40;
  var BRICK_HEIGHT = 15;
  var BLINK_TIME = 100;
  var PICKUP_PROB = 0.3;
  var LOCAL = 0;

  this.x = x;
	this.y = y;
  this.width = BRICK_WIDTH;
  this.height = BRICK_HEIGHT;
  this.type = type; //TYPE 0 = indestructible, TYPE 1 = 1 hit, TYPE 2 =  2 hits.
  this.pickup = null;
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
  if (gamemode === LOCAL) {
    if ( (type == 1) || (type == 2) ) {
      var rnd = Math.random();
      if (rnd < PICKUP_PROB) {
        this.pickup = new PickUp(x, y);
      }
    }
  }
  else {
    //En el modo online solo se generan los pickups para el jugador de la izquierda.
    if (id === 0) {
      if ( (type == 1) || (type == 2) ) {
        var rnd = Math.random();
        if (rnd < PICKUP_PROB) {
          this.pickup = new PickUp(x, y);
        }
      }
    }
  }
  var damaged = false;
  var brick_svg;
  var damage_svg;

  //Dibuja el SVG.
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
        //Dibuja la grieta en los Bricks dañados.
        if (!damaged) {
          damaged = true;
          damage_svg = container.polyline(this.x, this.y, this.x+10, this.y+10, this.x+15, this.y+5,
            this.x+20, this.y+10, this.x+25, this.y+2, this.x+38, this.y+11);
          damage_svg.addClass('damagebrick');
        }
      }
      else {
        //Destello al golpear los Bricks indestructibles.
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

  //Elimina los Bricks destruidos.
  this.draw = function() {
    if ( (this.hits === 0) && (this.type !== 0)) {
      brick_svg.remove();
      if (damage_svg != null) {
        damage_svg.remove();
      }
    }
  };

}
