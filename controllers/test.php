<?php

require('mysql.php');

$encrypt_password = "'" . md5(123456) . "'";
$table = "users";
$toSelectColumns = array("*");
$toWhereColumns = array("name", "password");
$values = array("'rafa'", $encrypt_password);
$users = query($table, $toSelectColumns, $toWhereColumns, $values);

 ?>
