function Level (gamemode) {

  var BRICK_WIDTH = 40;
  var BRICK_HEIGHT = 15;
  var BRICK_PADDING_Y = 25;
  var BRICKS_LVL1 = 65;
  var BRICKS_LVL2 = 91;
  var BRICKS_LVL3 = 104;
  var BRICKS_LVL4 = 143;
  var BRICKS_LVL5 = 143;

  this.gamemode = gamemode;
  this.bricks = [];
  this.amount_bricks;

  //Genera los bricks y su tipo, dependiendo el nivel.
  this.initLevel = function(container, id, level) {
    var brick_x = 0;
    var brick_y;
    var column = 0;
    var row = 0;
    this.amount_bricks = 0;
    switch (level) {
      case 1: brick_y = 50;
              for (i = 0; i < BRICKS_LVL1; i++) {
                if (row === 0) {
                  this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                }
                else {
                  this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                }
                this.amount_bricks++;
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else{
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 2: var column_limit = 1;
              brick_y = 15;
              for (i = 0; i < BRICKS_LVL2; i++) {
                if (row == 12){
                  if (column == 12){
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                  }
                  else {
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                  }
                }
                else {
                  this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                }
                this.amount_bricks++;
                column++;
                if (column == column_limit){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  column_limit++;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 3: brick_y = BRICK_PADDING_Y;
              var first = true;
              var count = 0;
              for (i = 0; i < BRICKS_LVL3; i++) {
                if ( ((row % 2) !== 0) && (row != 7) ) {
                  if ( (column >= 0) && (column < 3) ) {
                    if (first && (count < 3)) {
                      this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                      this.amount_bricks++;
                      count++;
                    }
                    else {
                      this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 0);
                    }
                  }
                  else {
                    if ( (column > 9) && (column < 13) ) {
                      if (!first && (count < 3)) {
                        this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                        this.amount_bricks++;
                        count++;
                      }
                      else {
                        this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 0);
                      }
                    }
                    else {
                      this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 0);
                    }
                  }
                }
                else {
                  this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                  this.amount_bricks++;
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT + BRICK_PADDING_Y;
                  column = 0;
                  row++;
                  if (count == 3) {
                    count = 0;
                    if (first) {
                      first = false;
                    }
                    else {
                      first = true;
                    }
                  }
                }
                else{
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 4: brick_y = BRICK_PADDING_Y;
              j = 0;
              for (i = 0; i < BRICKS_LVL4; i++) {
                if ( (row === 0) || (row == 10) ) {
                  if ( (column > 0) && (column < 12)){
                    this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                    this.amount_bricks++;
                    j++;
                  }
                }
                else {
                  if ( (row == 1) || (row == 9) ) {
                    if ( (column == 1) || (column == 11)){
                      this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                      this.amount_bricks++;
                      j++;
                    }
                  }
                  else {
                    if ( (row == 2) || (row == 8) ) {
                      if ( (column !== 0) && (column != 2) && (column != 10) && (column != 12)){
                        this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                        this.amount_bricks++;
                        j++;
                      }
                    }
                    else {
                      if ( (row == 3) || (row == 7) ) {
                        if ( (column == 1) || (column == 3) || (column == 9) || (column == 11)){
                          this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                          this.amount_bricks++;
                          j++;
                        }
                      }
                      else {
                        if ( (row == 4) || (row == 6) ) {
                          if ( (column !== 0) && (column != 2) && (column != 4) && (column != 8) && (column != 10) && (column != 12)){
                            this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                            this.amount_bricks++;
                            j++;
                          }
                        }
                        else {
                          if (row == 5) {
                            if ( (column !== 0) && (column != 2) && (column != 4) && (column != 6) && (column != 8) && (column != 10) && (column != 12)){
                              this.bricks[j] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                              this.amount_bricks++;
                              j++;
                            }
                          }
                        }
                      }
                    }
                  }
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;

      case 5: brick_y = BRICK_PADDING_Y;
              for (i = 0; i < BRICKS_LVL5; i++) {
                if (row == 5){
                  if ( (column > 2) && (column < 10)){
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 0);
                  }
                  else {
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                    this.amount_bricks++;
                  }
                }
                else {
                  if ( (row === 0) || (row == 10) ){
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 2);
                    this.amount_bricks++;
                  }
                  else {
                    this.bricks[i] = new Brick(this.gamemode, id, brick_x, brick_y, 1);
                    this.amount_bricks++;
                  }
                }
                column++;
                if (column == 13){
                  brick_x = 0;
                  brick_y = brick_y + BRICK_HEIGHT;
                  column = 0;
                  row++;
                }
                else {
                  brick_x = brick_x + BRICK_WIDTH;
                }
              }
              break;
    }
    for(i = 0; i < this.bricks.length; i++) {
      this.bricks[i].init(container);
    }
  };

}
