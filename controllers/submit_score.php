<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  $table = "scores_single";
  $columns = array("id_user", "score");
  $values = array($_SESSION['id'], $_REQUEST['score']);
  insert($table, $columns, $values);

}
else {
  header("location:../".$_SESSION['prev']);
}
