//Controles.
var Key = {
  pressed: {},

  LEFT1: 90,
  RIGHT1: 88,
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
