<?php
  session_start();
  include("com/connect.php");
  if (isset($_POST["logout"])) {
    $_SESSION["loggedin"] = false;
    session_destroy();
  }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, shrink-to-fit=no'>
    <title>Noteboard</title>
    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300i,400" rel="stylesheet">
    <link rel='stylesheet' href='./styles/stylesheet.css'>
    <script src='./scripts/utilities.js'></script>
    <script src='./scripts/library.js'></script>
  </head>
  <body>
    <div class='container'>
      <div class='container__header'>
        Noteboard
      </div>
      <div class='container__content'>
        <?php
          if ($_SESSION["loggedin"]) {
            include("./com/board.php");
          } elseif (isset($_POST["register"])) {
            include("./com/register.php");
          } elseif (isset($_POST["login"])) {
            include("./com/login.php");
          } else {
            if (!isset($_GET["register"])) {
              include("./com/form_login.php");
            } else {
              include("./com/form_register.php");
            }
          }
        ?>
      </div>
    </div>
  </body>
</html>
