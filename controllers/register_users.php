<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  define("USERNAMENULL", 0);
  define("USERNAMECHARACTERS", 1);
  define("PASSWORDNULL", 2);
  define("PASSWORDCHARACTERS", 3);
  define("REPEATPASSWORDNULL", 4);
  define("REPEATPASSWORDCHARACTERS", 5);
  define("PASSWORDNOTSAME", 6);
  define("USERNAMEEXIST", 7);

  $username = $_REQUEST['username'];
  $password = $_REQUEST['password'];
  $repeat_password = $_REQUEST['repeat_password'];
  $errors = array();
  if ($username == null || $username == "") {
    array_push($errors, USERNAMENULL);
  }
  if (strlen($username) < 4) {
    array_push($errors, USERNAMECHARACTERS);
  }
  if ($password == null || $password == "") {
    array_push($errors, PASSWORDNULL);
  }
  if (strlen($password) < 6) {
    array_push($errors, PASSWORDCHARACTERS);
  }
  if ($repeat_password == null || $repeat_password == "") {
    array_push($errors, REPEATPASSWORDNULL);
  }
  if (strlen($repeat_password) < 6) {
    array_push($errors, REPEATPASSWORDCHARACTERS);
  }
  if ($password != $repeat_password) {
    array_push($errors, PASSWORDNOTSAME);
  }
  $table = "users";
  $toSelectColumns = array("name");
  $toWhereColumns = array("name");
  $values = array("'" . $username . "'");
  $users = query($table, $toSelectColumns, $toWhereColumns, $values);
  if (sizeof($users) > 0) {
    array_push($errors, USERNAMEEXIST);
  }
  if (sizeof($errors) == 0) {
    $encrypt_password = "'" . md5($password) . "'";
    $table = "users";
    $columns = array("name", "password");
    $values = array("'" . $username . "'", $encrypt_password);
    $last_id = insert($table, $columns, $values);
    $table = "scores_multi";
    $columns = array("id_user", "win", "lose");
    $values = array($last_id, 0, 0);
    insert($table, $columns, $values);
    $_SESSION['id'] = $last_id;
    $_SESSION['name'] = $username;
    $_SESSION['type'] = "users";
  }
  $json_errors = json_encode($errors);
  echo($json_errors);

}
else {
  header("location:../".$_SESSION['prev']);
}
