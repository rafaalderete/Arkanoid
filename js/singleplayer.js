//Clase Principal del juego.
function Arkanoid() {

  var LIMIT_LEVEL = 5;
  var LEVEL_TIMER = 2500;
  var GAMEOVER_HEIGHT = 120;

  var container = Snap("#container");
  var viewbox = container.attr('viewBox');
  var player = new Player (0, 3, container);
  var level = 1;
  var game_started = false;
  var level_started = false;
  var background_start_svg;
  var controls_svg;
  var background_level_svg;
  var level_svg;
  var submit_score_svg;
  var yes_svg;
  var no_svg;
  var transition = new Audio('./resources/sounds/transition.ogg');

  function levelTransition() {
    background_level_svg = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background_level_svg.addClass('backgroundlevel');
    transition.play();
    level_svg = container.text(viewbox.width/2-35, viewbox.height/2, "Level " + level);
    level_svg.addClass('levelmessage');
    setTimeout(function(){
      level_started = true;
      background_level_svg.remove();
      level_svg.remove();
    }, LEVEL_TIMER);
  }

  function checkPlayerLoseLife() {
    if (player.checkLoseLife()) {
      player.lifes--;
      if (player.lifes > 0) {
        player.resetPosition();
      }
    }
  }

  function checkPlayerWinLevel() {
    if (player.checkWinLevel()) {
      level++;
      if (level <= LIMIT_LEVEL) {
        level_started = false;
        player.resetPosition();
        player.resetBricks();
        player.initLevel(level);
        levelTransition();
      }
    }
  }

  function update() {
    player.update();
  }

  function draw() {
    player.draw();
  }

  this.checkGameOver = function() {
    if (player.lifes === 0) {
      var lose1_svg = container.rect(0, viewbox.height/2 -75, container.attr('width'), GAMEOVER_HEIGHT);
      var lose2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 - 50, "You Lose!");
      var score_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 25, "Score: " + player.score);
      submit_score_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 10, "Submit Score?");
      yes_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 + 35, "Yes");
      no_svg = container.text(viewbox.width/2 + 15, viewbox.height/2 + 35, "No");
      lose1_svg.addClass('lose');
      lose2_svg.addClass('levelmessage');
      score_svg.addClass('levelmessage');
      submit_score_svg.addClass('levelmessage');
      yes_svg.addClass('levelmessage');
      no_svg.addClass('levelmessage');
      yes_svg.attr({
        id: 'yes'
      });
      no_svg.attr({
        id: 'no'
      });
      return true;
    }
    else {
      if (level > LIMIT_LEVEL) {
        var win1_svg = container.rect(0, viewbox.height/2 -75, container.attr('width'), GAMEOVER_HEIGHT);
        var win2_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 - 50, "You Win!");
        var score_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 25, "Score: " + player.score);
        submit_score_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 10, "Submit Score?");
        yes_svg = container.text(viewbox.width/2 - 35, viewbox.height/2 + 35, "Yes");
        no_svg = container.text(viewbox.width/2 + 15, viewbox.height/2 + 35, "No");
        win1_svg.addClass('win');
        win2_svg.addClass('levelmessage');
        score_svg.addClass('levelmessage');
        submit_score_svg.addClass('levelmessage');
        yes_svg.addClass('levelmessage');
        no_svg.addClass('levelmessage');
        yes_svg.attr({
          id: 'yes'
        });
        no_svg.attr({
          id: 'no'
        });
        return true;
      }
      else {
        return false;
      }
    }
  };

  this.checkSubmit = function(confirm) {
    submit_score_svg.remove();
    yes_svg.remove();
    no_svg.remove();
    var ty_playing_svg;
    if (confirm == "Y") {
      var submitted_svg = container.text(viewbox.width/2 - 60, viewbox.height/2 + 10, "Score Submitted");
      ty_playing_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 30, "Thank you for Playing!");
      submitted_svg.addClass('levelmessage');
    }
    else {
      ty_playing_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 10, "Thank you for Playing!");
    }
    ty_playing_svg.addClass('levelmessage');
  };

  //Envia la puntación al servidor.
  this.sendScore = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'controllers/submit_score.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var self = this;
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        self.checkSubmit("Y");
      }
    };
    xhr.send("score=" + player.score);
  };

  this.init = function() {
    var background = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background.addClass('backgroundlevel');
    player.init();
    player.initLevel(level);
    background_start_svg = container.rect(0, 0, container.attr('width'), container.attr('height'));
    background_start_svg.addClass('backgroundlevel');
    var controls1_svg = container.text(viewbox.width/2 - 40, viewbox.height/2 - 50, "Controls:");
    var controls2_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 - 25, "Z: Move Left");
    var controls3_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 - 5, "X: Move Right");
    var controls4_svg = container.text(viewbox.width/2 - 55, viewbox.height/2 + 15, "S: Shoot");
    var controls5_svg = container.text(viewbox.width/2 - 90, viewbox.height/2 + 100, "Press \"Space\" to Start.");
    controls1_svg.addClass('levelmessage');
    controls2_svg.addClass('levelmessage');
    controls3_svg.addClass('levelmessage');
    controls4_svg.addClass('levelmessage');
    controls5_svg.addClass('levelmessage');
    controls_svg = container.g(controls1_svg, controls2_svg, controls3_svg, controls4_svg, controls5_svg);
  };

  this.run = function() {
    if (game_started) {
      if (level_started) {
        update();
        draw();
        checkPlayerLoseLife();
        checkPlayerWinLevel();
      }
    }
    else {
      if (Key.isDown(Key.START)) {
        game_started = true;
        background_start_svg.remove();
        controls_svg.remove();
        levelTransition();
      }
    }
  };

}

//Main.
$(document).ready(function() {
  var elementExists = document.getElementById("container");
  if (elementExists != null) {
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    var game = new Arkanoid();
    game.init();
    var loop = setInterval(function() {
      game.run();
      if (game.checkGameOver()){
        clearInterval(loop);
      }
    }, 1000/30);

    $('svg').on("click", '#yes', function() {
      game.sendScore();
    });

    $('svg').on("click", '#no', function() {
      game.checkSubmit("N");
    });
  }
});
