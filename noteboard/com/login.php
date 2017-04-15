<?php
  $username = $_POST["username"];
  $password = $_POST["password"];

  $conn = connect_to_noteboard();
  $query_user_row = "SELECT * FROM users WHERE username=\"$username\";";
  $get_user_row = $conn->query($query_user_row);
  $user_row = $get_user_row->fetch_array(MYSQLI_ASSOC);

  if ($user_row["password"] == $password) {
    $_SESSION["loggedin"] = true;
    $_SESSION["user_id"] = $user_row["id"];
    $_SESSION["username"] = $user_row["username"];
    $_SESSION["fullname"] = $user_row["fullname"];
    include("board.php");
  } else {
    echo "<span class='content__unsuccessful'>Login unsuccessful. Please try again.</span>";
    include("./com/form_login.php");
  }
?>
