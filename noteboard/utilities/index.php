<?php
  function connect_to_noteboard () {
    $server = "localhost";
    $username = "lisabe7_me";
    $password = "cobain612";
    $db = "lisabe7_noteboard";

    $connection = new mysqli($server, $username, $password, $db);

    return $connection;
  }

  function send_query ($query) {
    return connect_to_noteboard()->query($query);
  }

  function list_users () {
    $user_rows = Array();
    $users = send_query("SELECT * FROM users;");

    while ($user_row = $users->fetch_assoc()) {
      $user_rows[] = $user_row;
    }

    return $user_rows;
  }

  function register () {
    $fullname = $_POST["fullname"];
    $username = $_POST["username"];
    $password = $_POST["password"];

    $exists = false;

    $users = list_users();

    if ($users) {
      foreach ($users as $user_row) {
        if ($user_row["username"] == $username) {
          echo "$username already exists. \n";
          $exists = true;
        }
      }
    }

    if (!$exists) {
      send_query("INSERT INTO users (fullname, username, password) VALUES ('$fullname', '$username', '$password');");
      login();
    }
  }

  function login () {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $users = list_users();

    $username_match = false;
    $password_match = false;

    if ($users) {
      foreach ($users as $user_row) {
        if ($username == $user_row["username"]) {
          $username_match = true;
          if ($password == $user_row["password"]) {
            $password_match = true;
            $user_id = $user_row["id"];
          }
        }
      }
    }

    if (!$username_match) {
      echo "Username does not exist. \n";
    } elseif (!$password_match) {
      echo "Password does not match. \n";
    } else {
      echo "$user_id";
    }
  }

  function load_board () {
    $user_id = $_POST["user_id"];
    $notes = Array();

    $get_fullname = send_query("SELECT fullname FROM users WHERE id='$user_id';")->fetch_assoc();
    $fullname = $get_fullname["fullname"];
    $notes["fullname"] = $fullname;
    $notes["user_id"] = $user_id;
    $notes["notes"] = Array();

    $note_rows = send_query("SELECT * FROM notes WHERE user_id='$user_id'");
    while ($note_row = $note_rows->fetch_assoc()) {
      $notes["notes"][$note_row["id"]] = $note_row["note"];
    }

    echo json_encode($notes);
  }

  function add_note () {
    $user_id = $_POST["user_id"];
    $note = $_POST["note"];

    $add_note = send_query("INSERT INTO notes (user_id, note) VALUES ('$user_id', '$note');");
  }

  function delete_note () {
    $user_id = $_POST["user_id"];
    $note_id = $_POST["note_id"];

    $delete_note = send_query("DELETE FROM notes WHERE id='$note_id';");
  }

  function clear_all_notes () {
    $user_id = $_POST["user_id"];
    echo $user_id;

    $clear_notes = send_query("DELETE FROM notes WHERE user_id='$user_id';");
  }

  function initialize_action_function () {
    switch ($_GET["action"]) {
      case "register":
        register();
      break;

      case "login":
        login();
      break;

      case "load":
        load_board();
      break;

      case "add":
        add_note();
      break;

      case "delete":
        delete_note();
      break;

      case "clear":
        clear_all_notes();
      break;

      default:
        echo "No valid action selected. \n";
      break;
    }
  }

  if (isset($_GET["action"])) {
    initialize_action_function();
  }
?>
