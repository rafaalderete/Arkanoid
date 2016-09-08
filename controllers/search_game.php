<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  //Estados de usuario.
  define("SEARCHING", 0);
  define("MATCHING", 1);
  define("MATCHED", 2);
  //Cantidad de niveles disponibles.
  define("MAXLEVELS", 5);

  $data = json_decode($_POST['data'], true);
  //Cuando un usuario entra en estado MATCHING quiere decir que creó un juego y está a la espera de un rival.
  //Cuando un rival se conecta a su juego se cambía su estado a MATCHED y se envían los id de donde deben envíar y buscar datos.
  if ($data['game_status'] == MATCHING) {
    $table = "games_online";
    $toSelectColumns = array("*");
    $toWhereColumns = array("id_game");
    $values = array($data['id_game']);
    $game = query($table, $toSelectColumns, $toWhereColumns, $values);
    if ($game[0]['id_player2'] != NULL) {
      //En donde debe enviar los datos.
      $player_data_id = "'" . $game[0]['id_game'] . $_SESSION['id'] . 'A' . "'";
      $player_initial_data_id = "'" . $game[0]['id_game'] . $_SESSION['id'] . 'B' . "'";
      //En donde debe buscar los datos de rival.
      $rival_data_id = "'" . $game[0]['id_game'] . $game[0]['id_player2'] . 'A' ."'";
      $rival_initial_data_id = "'" . $game[0]['id_game'] . $game[0]['id_player2'] . 'B' . "'";
      $table = "games_data";
      $columns = array("id");
      //Se crean las tuplas en donde se almacenarán los datos.
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
      //En caso de no encontrar rival, sigue en estado MATCHING.
      $response = array(
        'game_status'   => MATCHING
      );
    }
    $jsonresponse = json_encode($response);
    echo($jsonresponse);
  }
  else {
    //Cuando un usuario entra en estado SEARCHING, en la tabla games_online, busca por algún juego creado.
    //Si encuentra un juego, se actualiza dicha tupla, se cambia el estado del usuario a MATCHED y se le envía en donde debe buscar los datos del rival.
    if ($data['game_status'] == SEARCHING) {
      $table = "games_online";
      $toSelectColumns = array("*");
      $toWhereColumns = array("matched");
      $values = array(0);
      $gamesNoMatched = query($table, $toSelectColumns, $toWhereColumns, $values);
      //Encuentra un juego.
      if (sizeof($gamesNoMatched) > 0) {
        $i = 0;
        $flag = false;
        while( ($i < sizeof($gamesNoMatched)) && !$flag) {
          if ( ($gamesNoMatched[$i]['id_player2'] == NULL) && ($gamesNoMatched[$i]['id_player1'] != $_SESSION['id']) ) {
            $flag = true;
            $level = $gamesNoMatched[$i]['level'];
            $id_game = $gamesNoMatched[$i]['id_game'];
            //En donde debe envíar los datos.
            $player_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $_SESSION['id'] . 'A' . "'";
            $player_initial_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $_SESSION['id'] . 'B' . "'";
            //En donde debe buscar los datos del rival.
            $rival_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $gamesNoMatched[$i]['id_player1'] . 'A' . "'";
            $rival_initial_data_id = "'" . $gamesNoMatched[$i]['id_game'] . $gamesNoMatched[$i]['id_player1'] . 'B' . "'";
            //Actualiza la tupla de games_online con el nuevo jugador.
            $table = "games_online";
            $toSetColumns = array("id_player2", "matched");
            $toSetValues = array($_SESSION['id'], 1);
            $toWhereColumns = array("id_game");
            $toWhereValues = array($gamesNoMatched[$i]['id_game']);
            update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
            //Se crean las tuplas en donde se almacenarán los datos.
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
      //En caso de no econtrar juegos, crea uno y se pone en estado MATCHING.
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
