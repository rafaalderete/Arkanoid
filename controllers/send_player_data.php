<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($_POST['data'], true);
  $player_data = array(
    'game_started'   => $data['game_started'],
    'player_paddle' => $data['player_paddle'],
    'player_balls' => $data['player_balls']
  );
  $jsonplayer_data = json_encode($player_data);
  file_put_contents("playersdata/$data[player_data].json",$jsonplayer_data);
}
else {
  header("location:../".$_SESSION['prev']);
}
