<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  session_destroy();
}
else {
  header("location:../".$_SESSION['prev']);
}
