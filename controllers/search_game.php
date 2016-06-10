<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  define("SEARCHING", 0);
  define("MATCHING", 1);
  define("MATCHED", 2);
  define("MAXLEVELS", 5);

  $connection = mysqli_connect("localhost","root","","test") or die();

  $data = json_decode($_POST['data'], true);
  if ($data['game_status'] == MATCHING) {
    $sql = "SELECT * FROM games_online WHERE id_game='$data[id_game]'";
    $record = mysqli_query($connection, $sql) or die(mysqli_error($connection));

    $rec = mysqli_fetch_array($record);
    if ($rec['id_player2'] != NULL) {
      $player_data = "$rec[id_game]_$_SESSION[id]";
      $rival_data = "$rec[id_game]_$rec[id_player2]";
      $response = array(
        'game_status'   => MATCHED,
        'level' => $rec['level'],
        'player_data' => $player_data,
        'rival_data' => $rival_data
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
      $sql = "SELECT * FROM games_online WHERE matched=0";
      $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));

      $rows = mysqli_num_rows($records);
      if ($rows > 0) {
        $flag = false;
        while($rec = mysqli_fetch_array($records)) {
          if ( ($rec['id_player2'] == NULL) && ($rec['id_player1'] != $_SESSION['id']) ) {
            $flag = true;
            $level = $rec['level'];
            $id_game = $rec['id_game'];
            $player_data = "$rec[id_game]_$_SESSION[id]";
            $rival_data = "$rec[id_game]_$rec[id_player1]";
            $sql = "UPDATE games_online SET id_player2='$_SESSION[id]', matched=1 WHERE id_game='$rec[id_game]'";
            mysqli_query($connection, $sql) or die(mysqli_error($connection));
          }
        }
        if ($flag) {
          $response = array(
            'game_status'   => MATCHED,
            'level' => $level,
            'player_data' => $player_data,
            'rival_data' => $rival_data
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
        $sql = "INSERT INTO games_online (id_player1,level,matched) VALUES ('$_SESSION[id]','$level',0)";
        mysqli_query($connection, $sql) or die(mysqli_error($connection));

        $response = array(
          'game_status'   => MATCHING,
          'id_game'   => mysqli_insert_id($connection)
        );

        $jsonresponse = json_encode($response);
        echo($jsonresponse);
      }
    }
  }

  mysqli_close($connection);
}
else {
  header("location:../".$_SESSION['prev']);
}
