<?php
//Envío de datos de un jugador en el modo online-multiplayer para que se actualicen enla DB.
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($_POST['data'], true);
  $player_data = array(
    'game_started'   => $data['game_started'],
    'game_abandon'   => $data['game_abandon'],
    'ball_sync'   => $data['ball_sync'],
    'balls_speed'   => $data['balls_speed'],
    'ball_sync_received' => $data['ball_sync_received'],
    'player_paddle_x' => $data['player_paddle_x']
  );
  //La primera vez que envía datos.
  if ($data['initial']) {
    $player_dataex = array(
      'player_name' => $_SESSION['name'],
      'player_balls' => $data['player_balls'],
      'player_bricks' => $data['player_bricks']
    );
    $player_data = array_merge($player_data, $player_dataex);
  }
  else {
    if ($data['ball_sync']) {
      $player_dataex = array(
        'player_balls' => $data['player_balls']
      );
      $player_data = array_merge($player_data, $player_dataex);
    }
  }
  $jsonplayer_data = json_encode($player_data);
  $table = "games_data";
  $toSetColumns = array("data");
  $toSetValues = array($jsonplayer_data);
  $toWhereColumns = array("id");
  $toWhereValues = array($data['player_data_id']);
  update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
}
else {
  header("location:../".$_SESSION['prev']);
}
