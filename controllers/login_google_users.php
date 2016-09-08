<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $_SESSION['name'] = $_REQUEST['name'];
  $_SESSION['type'] = "google_users";

  $table = "google_users";
  $toSelectColumns = array("*");
  $toWhereColumns = array("email");
  $values = array("'$_REQUEST[email]'");
  $users = query($table, $toSelectColumns, $toWhereColumns, $values);

  //Si el usuario google ya existe y el nombre es diferente, hace el update del nombre.
  if (sizeof($users) > 0) {
    $_SESSION['id'] = $users[0]['id_user'];
    if ($users[0]['name'] != $_REQUEST['name']) {
      $table = "google_users";
      $toSetColumns = array("name");
      $toSetValues = array("'$_REQUEST[name]'");
      $toWhereColumns = array("id_user");
      $toWhereValues = array("'$users[0][id_user]'");
      update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues);
    }
  }
  //En caso de que el usuario google no exista, lo crea.
  else {
    $table = "google_users";
    $columns = array("email", "name");
    $values = array("'$_REQUEST[email]'", "'$_REQUEST[name]'");
    $last_id = insert($table, $columns, $values);
    $table = "scores_multi";
    $columns = array("id_user", "win", "lose");
    $values = array($last_id, 0, 0);
    insert($table, $columns, $values);
    $_SESSION['id'] = $last_id;
  }

}
else {
  header("location:../".$_SESSION['prev']);
}
