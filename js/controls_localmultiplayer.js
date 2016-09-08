//Controles.
var Key = {
  pressed: {},

  LEFT1: 90,
  RIGHT1: 88,
  START1: 32,
  START2: 13,
  LEFT2: 37,
  RIGHT2: 39,

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
