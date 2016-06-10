<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode($_POST['data'], true);
  $jsonplayer_data = file_get_contents("playersdata/$data[rival_data].json");
  echo($jsonplayer_data);
}
else {
  header("location:../".$_SESSION['prev']);
}
