<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $table = $_SESSION['type'];
  $toSelectColumns = array("name");
  $toWhereColumns = array("id_user");
  $values = array($_SESSION['id']);
  $jsonplayer_name = query($table, $toSelectColumns, $toWhereColumns, $values);
  echo($jsonplayer_name[0]['name']);
}
else {
  header("location:../".$_SESSION['prev']);
}
