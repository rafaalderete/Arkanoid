<?php
//Devuelve los datos de un rival.
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($_POST['data'], true);
  $table = "games_data";
  $toSelectColumns = array("data");
  $toWhereColumns = array("id");
  $values = array($data['rival_data_id']);
  $jsonplayer_data = query($table, $toSelectColumns, $toWhereColumns, $values);
  foreach ($jsonplayer_data as $jd){
    echo($jd[0]);
  }
}
else {
  header("location:../".$_SESSION['prev']);
}
