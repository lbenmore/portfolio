<?php
  $fullname = $_POST["fullname"];
  $username = $_POST["username"];
  $password = $_POST["password"];
  $confirm = $_POST["password_confirm"];

  if (isset($fullname) && !empty($fullname) && isset($username) && !empty($username) && isset($password) && !empty($password) && isset($confirm) && !empty($confirm) && $password == $confirm) {
    $conn = connect_to_noteboard();
    $query_create_user = "INSERT INTO users (fullname, username, password) VALUES (\"$fullname\", \"$username\", \"$password\");";
    $create_user = $conn->query($query_create_user);

    include("login.php");
  } elseif ($password != $confirm) {
    echo "Password fields did not match.";
    include("./com/form_register.php");
  } else {
    echo "Please fill in all fields.";
    include("./com/form_register.php");
  }
?>
