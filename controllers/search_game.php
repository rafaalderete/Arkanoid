<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  define("SEARCHING", 0);
  define("MATCHING", 1);
  define("MATCHED", 2);
  define("MAXLEVELS", 5);

  $data = json_decode($_POST['data'], true);
  if ($data['game_status'] == MATCHING) {
    $table = "games_online";
    $toSelectColumns = array("*");
    $toWhereColumns = array("id_game");
    $values = array($data['id_game']);
    $game = query($table, $toSelectColumns, $toWhereColumns, $values);
    if ($game[0]['id_player2'] != NULL) {
      $player_data_id = "'" . $game[0]['id_game'] . $_SESSION['id'] . 'A' . "'";
      $player_initial_data_id = "'" . $game[0]['id_game'] . $_SESSION['id'] . 'B' . "'";
      $rival_data_id = "'" . $game[0]['id_game'] . $game[0]['id_player2'] . 'A' ."'";
      $rival_initial_data_id = "'" . $game[0]['id_game'] . $game[0]['id_player2'] . 'B' . "'";
      $table = "games_data";
      $columns = array("id");
      $values = array($player_data_id);
      insert($table, $columns, $values);
      $values = array($player_initial_data_id);
      insert($table, $columns, $values);
      $response = array(
        'game_status'   => MATCHED,
        'level' => $game[0]['level'],
        'player_data_id' => $player_data_id,
        'player_initial_data_id' => $player_initial_data_id,
        'rival_data_id' => $rival_data_id,
        'rival_initial_data_id' => $rival_initial_data_id
      );
    }
    else {
      $response = array(
        'game_status'   => MATCHING
      );
    }
    $jsonresponse = json_encode($response);
    echo($jsonresponse);
  }
  else {
    if ($data['game_status'] == SEARCHING) {
      $table = "games_online";
      $toSelectColumns = array("*");
      $toWhereColumns = array("matched");
      $values = array(0);
      $gamesNoMatched = query($table, $toSelectColumns, $toWhereColumns, $values);
      if (sizeof($gamesNoMatched) > 0) {
        $i = 0;
        $flag = false;
        while( ($i < sizeof($gamesNoMatched)) && !$flag) {
          if ( ($gamesNoMatched[$i]['id_player2'] == NULL) && ($gamesNoMatched[$i]['id_player1'] != $_SESSION['id']) ) {
            $flag = true;
            $level = $gamesNoMatched[$i]['level'];
            $id_game = $gamesNoMatched[$i]['id_game'];
            $player_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $_SESSION['id'] . 'A' . "'";
            $player_initial_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $_SESSION['id'] . 'B' . "'";
            $rival_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $gamesNoMatched[$i]['id_player1'] . 'A' . "'";
            $rival_initial_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $gamesNoMatched[$i]['id_player1'] . 'B' . "'";
            $table = "games_online";
            $toSetColumns = array("id_player2", "matched");
            $toSetValues = array($_SESSION['id'], 1);
            $toWhereColumns = array("id_game");
            $toWhereValues = array($gamesNoMatched[$i]['id_game']);
            update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
            $table = "games_data";
            $columns = array("id");
            $values = array($player_data_id);
            insert($table, $columns, $values);
            $values = array($player_initial_data_id);
            insert($table, $columns, $values);

          }
          $i++;
        }
        if ($flag) {
          $response = array(
            'game_status'   => MATCHED,
            'level' => $level,
            'player_data_id' => $player_data_id,
            'player_initial_data_id' => $player_initial_data_id,
            'rival_data_id' => $rival_data_id,
            'rival_initial_data_id' => $rival_initial_data_id
          );
        }
        else {
          $response = array(
            'game_status'   => MATCHING
          );
        }
        $jsonresponse = json_encode($response);
        echo($jsonresponse);
      }
      else {
        $level = rand(1, MAXLEVELS);
        $table = "games_online";
        $columns = array("id_player1", "level", "matched");
        $values = array($_SESSION['id'], $level, 0);
        $lastId = insert($table, $columns, $values);
        $response = array(
          'game_status'   => MATCHING,
          'id_game'   => $lastId
        );
        $jsonresponse = json_encode($response);
        echo($jsonresponse);
      }
    }
  }

}
else {
  header("location:../".$_SESSION['prev']);
}
