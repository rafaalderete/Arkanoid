<?php
//Actuliza el puntaje de un usuario, ya sea haya ganado o perdido en el modo online-multiplayer.
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $table = "scores_multi";
  $toSelectColumns = array("*");
  $toWhereColumns = array("id_user");
  $values = array($_SESSION['id']);
  $score = query($table, $toSelectColumns, $toWhereColumns, $values);
  if ($_REQUEST['result'] == "WIN") {
    $toSetColumns = array("win");
    $toSetValues = array($score[0]['win'] + 1);
    $toWhereColumns = array("id_user");
    $toWhereValues = array($_SESSION['id']);
    update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
  }
  else {
    $toSetColumns = array("lose");
    $toSetValues = array($score[0]['lose'] + 1);
    $toWhereColumns = array("id_user");
    $toWhereValues = array($_SESSION['id']);
    update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
  }
}
else {
  header("location:../".$_SESSION['prev']);
}
