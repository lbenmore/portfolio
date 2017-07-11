<?php
  $name = $_POST["name"];
  $email = $_POST["email"];
  $msg = $_POST["msg"];

  $my_email = "lbenmore@gmail.com";
  $subject = "$name sent you a message. DO NOT DELETE.";
  $headers = "From: $email \r\nReply-To: $email\r\nX-Mailer: PHP/" . phpversion();

  if (mail($my_email, $subject, $msg, $headers)) {
    echo "Email successfully sent.";
  } else {
    echo "Something has gone awry!";
  }
?>
