<?php
  session_start();
  $_SESSION['prev'] = "play_singleplayer.php";
?>

<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="google-signin-client_id" content="332020513166-urs8iui38gd74512o7dcjglsb9u23cij.apps.googleusercontent.com">
  <title>Arkanoid | Single Player</title>
  <link href="css/general.css" rel="stylesheet" />
  <link href="css/game.css" rel="stylesheet" />
  <script src="https://apis.google.com/js/platform.js" async defer></script>
  <script type="text/javascript" src="js/libs/jquery-2.2.3.min.js"></script>
  <script type="text/javascript" src="js/libs/snap.svg-min.js"></script>
  <script type="text/javascript" src="js/general.js"></script>
  <script type="text/javascript" src="js/login_register.js"></script>
  <script type="text/javascript" src="js/singleplayer.js"></script>
</head>

<body>
  <header>
    <h1>
      <span class="title">Arkanoid</span>
      <a href="index.php"><img class="logo" src="resources/img/logo.png" alt="Arkanoid"/></a>
    </h1>
    <?php
      if (isset($_SESSION['name']) && $_SESSION['name']) {
        echo('<div class ="dropdown logged">
                <span class="dropdownbutton button">'.$_SESSION['name'].'</span>
                <ul class="dropdown-content">
                  <li><a class="button" onclick=signOut();>Log out</a></li>
                </ul>
              </div>');
      }
      else {
        echo('<a class="login" href="login.php"><img src="resources/img/login.png" alt="Login"/></a>');
      }
    ?>
  </header>

  <nav>
    <ul class="small-menu">
      <li>Menu</li>
      <li>☰</li>
    </ul>
    <ul class="big-menu">
      <li><a class="dropdownbutton button" href="index.php">Home</a></li>
      <li class ="dropdown">
        <span class="dropdownbutton button current">Play</span>
        <ul class="dropdown-content">
          <li><span class="button current">Single Player</span></li>
          <li><a class="button" href="play_localmultiplayer.php">Local Multiplayer</a></li>
          <li><a class="button" href="play_onlinemultiplayer.php">Online Multiplayer</a></li>
        </ul>
      </li>
      <li class ="dropdown">
        <span class="dropdownbutton button">Top-Scores</span>
        <ul class="dropdown-content">
          <li><a class="button" href="topscores_singleplayer.php">Single Player</a></li>
          <li><a class="button" href="topscores_multiplayer.php">Multiplayer</a></li>
        </ul>
      </li>
      <li><a class="dropdownbutton button" href="contact.php">Contact</a></li>
    </ul>
  </nav>

  <section>
    <?php
      if (isset($_SESSION['name']) && $_SESSION['name']) {
        echo('<div class="gamesingle">
                <svg id="container" width="100%" height="100%" viewBox="0 0 520 525"></svg>
              </div>');
      }
      else {
        echo('<div class="error">
                <p>You must be logged to play</p>
              </div>');
      }
    ?>

  </section>

  <footer>
      <ul>
        <li>
          <a href="">
            <svg class="svg-facebook" width="30px" height="30px" viewBox="0 0 0.494538 0.494538">
              <path id="facebook-background" fill="white" d="M0.467237 0.494538c0.0150774,0 0.0273011,-0.0122237
              0.0273011,-0.0273011l0 -0.439936c0,-0.0150774 -0.0122237,-0.0273011
              -0.0273011,-0.0273011l-0.439936 0c-0.0150774,0 -0.0273011,0.0122237
              -0.0273011,0.0272864l0 0.43995c0,0.0150774 0.0122237,0.0272864
              0.0273011,0.0272864l0.439936 1.47096e-005z"/>
              <path id="facebook" fill="black" d="M0.341219 0.494538l0 -0.191519
              0.0642811 0 0.00963481 -0.0746367 -0.0739159 0 0 -0.0476445c0,-0.0216084
              0.00600153,-0.0363328 0.0369947,-0.0363328l0.0395248 -1.47096e-005 0
              -0.0667523c-0.00683998,-0.000911997 -0.0303018,-0.00294193 -0.0576029,-0.00294193
              -0.0569704,0 -0.0959803,0.0347736 -0.0959803,0.0986428l0 0.0550434
              -0.0644576 0 0 0.0746367 0.0644576 0 0 0.191519 0.0770638 0z"/>
            </svg>
          </a>
        </li>
        <li>
          <a href="">
            <svg class="svg-twitter" width="30px" height="30px" viewBox="0 0 30 30.0009">
              <path id="twitter" fill="white" d="M30 3.55135c-1.10288,0.60326 -2.28991,1.00986 -3.53452,1.19323
              1.2703,-0.937223 2.2465,-2.4219 2.70625,-4.19004 -1.18969,0.868127 -2.50694,1.49796
              -3.90834,1.83724 -1.12325,-1.47139 -2.72309,-2.39178 -4.493,-2.39178 -3.39898,0
              -6.15485,3.39101 -6.15485,7.57397 0,0.593516 0.0540365,1.17197 0.159452,1.72562
              -5.11575,-0.315361 -9.65127,-3.33077 -12.6871,-7.91325 -0.529735,1.11882
              -0.833579,2.42013 -0.833579,3.80824 0,2.62741 1.08693,4.94567 2.73903,6.30367
              -1.00898,-0.0389771 -1.9586,-0.380027 -2.78864,-0.946967 0,0.0310045 0,0.0628949
              0,0.0947853 0,3.67005 2.1216,6.73064 4.93681,7.42692 -0.516447,0.17274
              -1.05947,0.265753 -1.62109,0.265753 -0.396858,0 -0.7822,-0.0478356 -1.1578,-0.13642
              0.783086,3.00921 3.05616,5.19902 5.74913,5.25926 -2.10654,2.03213 -4.76053,3.24308
              -7.64395,3.24308 -0.496959,0 -0.98683,-0.0363196 -1.46784,-0.106301 2.72309,2.14906
              5.95907,3.40253 9.43424,3.40253 11.322,0 17.5131,-11.5399 17.5131,-21.549 0,-0.327762
              -0.00620091,-0.654639 -0.0186027,-0.979744 1.20298,-1.06744 2.2465,-2.40152 3.07122,
              -3.92075m0 0l0 0 0 0z"/>
            </svg>
          </a>
        </li>
      </ul>
    <p>
      Written and coded by Alderete Alexis
    </p>
  </footer>
</body>

</html>
