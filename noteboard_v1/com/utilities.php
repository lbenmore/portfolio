<?php
  function connect_to_noteboard () {
    $server = "localhost";
    $username = "lisabe7_me";
    $password = "cobain612";
    $db = "lisabe7_noteboard";

    $connection = new mysqli($server, $username, $password, $db);

    return $connection;
  }
?>
