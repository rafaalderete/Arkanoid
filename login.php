<?php
session_start();
if (!isset($_SESSION['name'])) {
  $_SESSION['name'] = $_REQUEST['name'];
  $_SESSION['email'] = $_REQUEST['email'];
}

$connection = mysqli_connect("localhost","root","","test") or die();

$sql = "select * from users where email='$_REQUEST[email]'";
$records = mysqli_query($connection, $sql) or die(mysqli_error($connection));

$rows = mysqli_num_rows($records);
if ($rows > 0) {
  $rec = mysqli_fetch_array($records);
  if ($rec['name'] != $_REQUEST['name']) {
    $sql = "update users set name='$_REQUEST[name]' where email='$_REQUEST[email]'";
    mysqli_query($connection, $sql) or die(mysqli_error($connection));
  }
}
else {
  $sql = "insert into users(email,name) values ('$_REQUEST[email]','$_REQUEST[name]')";
  mysqli_query($connection, $sql) or die(mysqli_error($connection));
}

mysqli_close($connection);
