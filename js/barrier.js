function Barrier (y) {

  var BARRIER_INTERVAL_TIME = 50;

  this.active = false;
  this.y = y;
  var barrier1_svg;
  var barrier2_svg;
  var timer_barrier1;
  var timer_barrier2;

  //Dibuja el SVG.
  this.initBarrier1 = function(container) {
    barrier1_svg = container.polyline(0, this.y, 30, this.y + 10,
                                      60, this.y, 90, this.y + 10,
                                      120, this.y, 150, this.y + 10,
                                      180, this.y, 210, this.y + 10,
                                      240, this.y, 270, this.y + 10,
                                      300, this.y, 330, this.y + 10,
                                      360, this.y, 390, this.y + 10,
                                      420, this.y, 450, this.y + 10,
                                      480, this.y, 510, this.y + 10,
                                      520, this.y + 5);
    barrier1_svg.addClass('barrier');
  };

  this.initBarrier2 = function(container) {
    barrier2_svg = container.polyline(0, this.y + 15, 30, this.y + 5,
                                      60, this.y + 15, 90, this.y + 5,
                                      120, this.y + 15, 150, this.y + 5,
                                      180, this.y + 15, 210, this.y + 5,
                                      240, this.y + 15, 270, this.y + 5,
                                      300, this.y + 15, 330, this.y + 5,
                                      360, this.y + 15, 390, this.y + 5,
                                      420, this.y + 15, 450, this.y + 5,
                                      480, this.y + 15, 510, this.y + 5,
                                      520, this.y + 10);
    barrier2_svg.addClass('barrier');
  };

  this.barrierForm = function (container) {
    this.active = true;
    this.initBarrier1(container);
    var self = this;
    //Timers para lograr el efecto de intermitencia.
    timer_barrier1 = setInterval(function() {
      if (barrier1_svg == null) {
        self.initBarrier1(container);
      }
      else {
        barrier1_svg.remove();
        barrier1_svg = null;
      }
    }, BARRIER_INTERVAL_TIME);
    timer_barrier2 = setInterval(function() {
      if (barrier2_svg == null) {
        self.initBarrier2(container);
      }
      else {
        barrier2_svg.remove();
        barrier2_svg = null;
      }
    }, BARRIER_INTERVAL_TIME);
  };

  this.endBarrierForm = function () {
    this.active = false;
    clearInterval(timer_barrier1);
    clearInterval(timer_barrier2);
    if (barrier1_svg != null) {
      barrier1_svg.remove();
      barrier1_svg = null;
    }
    if (barrier2_svg != null) {
      barrier2_svg.remove();
      barrier2_svg = null;
    }
  };

}
