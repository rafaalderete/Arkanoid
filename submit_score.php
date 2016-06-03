<?php
session_start();

$connection = mysqli_connect("localhost","root","","test") or die();

$sql = "select * from users where email='$_SESSION[email]'";
$records = mysqli_query($connection, $sql) or die(mysqli_error($connection));

$rec = mysqli_fetch_array($records);
$sql = "insert into scores_single(id_user,score) values ('$rec[id_user]','$_REQUEST[score]')";
mysqli_query($connection, $sql) or die(mysqli_error($connection));

mysqli_close($connection);
