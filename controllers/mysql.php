<?php
define("IP", "localhost");
define("USER", "root");
define("PASS", "");
define("DB", "test");

function insert($table, $columns, $values) {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $sql = "INSERT INTO ". $table . " (";
  for ($i = 0; $i < sizeof($columns); $i++) {
    $sql .= $columns[$i];
    if ($i != sizeof($columns)-1) {
      $sql .= ",";
    }
  }
  $sql .= ")";
  $sql .= " VALUES (";
  for ($i = 0; $i < sizeof($values); $i++) {
    $sql .= $values[$i];
    if ($i != sizeof($values)-1) {
      $sql .= ",";
    }
  }
  $sql .= ")";
  mysqli_query($connection, $sql) or die(mysqli_error($connection));
  return mysqli_insert_id($connection);
  mysqli_close($connection);
}

function delete($table, $column, $value) {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $sql = "DELETE FROM ". $table . " WHERE " . $column . "=" . $value;
  echo $sql;
  mysqli_query($connection, $sql) or die(mysqli_error($connection));
  mysqli_close($connection);
}

function update($table, $toSetColumns, $toSetValues, $toWhereColumns, $toWhereValues) {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $sql = "UPDATE ". $table . " SET";
  for ($i = 0; $i < sizeof($toSetColumns); $i++) {
    $value = mysqli_real_escape_string($connection, $toSetValues[$i]);
    $sql .= " " . $toSetColumns[$i] . "='" . $value . "'";
    if ($i != sizeof($toSetColumns)-1) {
      $sql .= ",";
    }
  }
  $sql .= " WHERE";
  for ($i = 0; $i < sizeof($toWhereColumns); $i++) {
    $sql .= " " . $toWhereColumns[$i] . "=" . $toWhereValues[$i];
    if ($i != sizeof($toWhereColumns)-1) {
      $sql .= " AND";
    }
  }
  mysqli_query($connection, $sql) or die(mysqli_error($connection));
  mysqli_close($connection);
}

function query($table, $toSelectColumns, $toWhereColumns, $values) {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $sql = "SELECT";
  for ($i = 0; $i < sizeof($toSelectColumns); $i++) {
    $sql .= " " . $toSelectColumns[$i];
    if ($i != sizeof($toSelectColumns)-1) {
      $sql .= ",";
    }
  }
  $sql .= " FROM " . $table . " WHERE";
  for ($i = 0; $i < sizeof($toWhereColumns); $i++) {
    $sql .= " " . $toWhereColumns[$i] . "=" . $values[$i];
    if ($i != sizeof($toWhereColumns)-1) {
      $sql .= " AND";
    }
  }
  $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));
  $queryResult = array();
  while ($rec = mysqli_fetch_array($records)){
    array_push($queryResult, $rec);
  }
  return $queryResult;
  mysqli_close($connection);
}

function topScoresSingle() {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $scores = array();
  $sql = "SELECT * FROM scores_single
          INNER JOIN users ON scores_single.id_user=users.id_user
          ORDER BY score DESC LIMIT 15";
  $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));
  while ($rec = mysqli_fetch_array($records)){
    array_push($scores, $rec);
  }
  $sql = "SELECT * FROM scores_single
          INNER JOIN google_users ON scores_single.id_user=google_users.id_user
          ORDER BY score DESC LIMIT 15";
  $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));
  while ($rec = mysqli_fetch_array($records)){
    array_push($scores, $rec);
  }
  return $scores;
  mysqli_close($connection);
}

function topScoresMulti() {
  $connection = mysqli_connect(IP, USER, PASS, DB) or die();
  $scores = array();
  $sql = "SELECT * FROM scores_multi
          INNER JOIN users ON scores_multi.id_user=users.id_user
          ORDER BY win DESC LIMIT 15";
  $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));
  while ($rec = mysqli_fetch_array($records)){
    array_push($scores, $rec);
  }
  $sql = "SELECT * FROM scores_multi
          INNER JOIN google_users ON scores_multi.id_user=google_users.id_user
          ORDER BY win DESC LIMIT 15";
  $records = mysqli_query($connection, $sql) or die(mysqli_error($connection));
  while ($rec = mysqli_fetch_array($records)){
    array_push($scores, $rec);
  }
  return $scores;
  mysqli_close($connection);
}
