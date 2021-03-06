<?php
require('mysql.php');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  define("USERNAMENULL", 0);
  define("USERNAMECHARACTERS", 1);
  define("PASSWORDNULL", 2);
  define("PASSWORDCHARACTERS", 3);
  define("USERNAMEPASSWORDERROR", 8);

  $username = filter_var($_REQUEST['username'], FILTER_SANITIZE_STRING);
  $password = filter_var($_REQUEST['password'], FILTER_SANITIZE_STRING);
  $errors = array();
  //Controles de los distintos campos.
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
  $encrypt_password = "'" . md5($password) . "'";
  $table = "users";
  $toSelectColumns = array("*");
  $toWhereColumns = array("name", "password");
  $values = array("'" . $username . "'", $encrypt_password);
  $users = query($table, $toSelectColumns, $toWhereColumns, $values);
  if (sizeof($users) == 0) {
    array_push($errors, USERNAMEPASSWORDERROR); //Usuario inexistente.
  }
  if (sizeof($errors) == 0) {
    $_SESSION['id'] = $users[0]['id_user'];
    $_SESSION['name'] = $username;
    $_SESSION['type'] = "users";
  }
  //Se envía un json con todos los errores encontrados.
  $json_errors = json_encode($errors);
  echo($json_errors);

}
else {
  header("location:../".$_SESSION['prev']);
}
