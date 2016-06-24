<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($_POST['data'], true);
  if ($data['id_game'] != null) {
    $table = "games_online";
    $column = "id_game";
    $value = $data['id_game'];
    delete($table, $column, $value);
  }
  if ($data['player_initial_data_id'] != null) {
    $table = "games_data";
    $column = "id";
    $value = $data['player_initial_data_id'];
    delete($table, $column, $value);
  }
}
else {
  header("location:../".$_SESSION['prev']);
}
