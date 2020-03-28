<?php

class DB {
  public static $conn;

  function __construct () {
    include('db_creds.php');
    self::$conn = new mysqli($server, $username, $password, $database);
    return self::$conn;
  }
}

class Output {
  private static $arr = array();

  public function add ($key, $value) {
    self::$arr[$key] = $value;
  }

  public function return ($internal) {
    if ($internal) {
      return self::$arr;
    } else {
      echo json_encode(self::$arr);
    }
  }

  function __construct () {
    self::$arr["status"] = 0;
    self::$arr["message"] = "Output initialized";
  }
}

function delete_file ($internal, $user_id, $file_name) {
  $output = new Output;
  $output->add("message", "Delete File initialized");

  if (is_dir("../files/$user_id")) {
    $files = scandir("../files/$user_id");

    if (in_array($file_name, $files)) {
      if (unlink("../files/$user_id/$file_name")) {
        $output->add("status", 1);
        $output->add("message", "Successfully deleted $file_name");
      } else {
        $output->add("error", "Could not delete file");
      }
    } else {
      $output->add("error", "File does not exist");
    }
  } else {
    $output->add("error", "User directory does not exist");
  }

  return $output->return($internal);
}

function add_file ($internal, $user_id) {
  $output = new Output;
  $output->add("message", "Add File initialized");

  if (is_dir("../files") === false) mkdir("../files");
  if (is_dir("../files/$user_id") === false) mkdir("../files/$user_id");

  $file = $_FILES["file"];

  $file_name = $file["name"];
  $dir = "../files/$user_id";
  $path = "$dir/$file_name";

  $content = file_get_contents($file["tmp_name"]);

  if (file_put_contents($path, $content)) {
    $output->add("status", 1);
    $output->add("message", "Successfully uploaded $file");
  } else {
    $output->add("error", "Could not upload $file");
  }

  return $output->return($internal);
}

function get_files ($internal, $user_id) {
  $output = new Output;
  $output->add("message", "Get Files initialized");

  if (is_dir("../files") === false) mkdir("../files");
  if (is_dir("../files/$user_id") === false) mkdir("../files/$user_id");

  $files = scandir("../files/$user_id");
  array_splice($files, 0, 2);
  $output->add("files", $files);
  $output->add("status", 1);
  $output->add("message", "Successfully retrieved " . sizeof($files) . " files for $user_id");

  return $output->return($internal);
}

function delete_note ($internal, $user_id, $note_id) {
  $output = new Output;
  $output->add("message", "Delete Note initialized");

  $db = new DB;

  $sql = "DELETE FROM notes WHERE user_id='$user_id' AND note_id='$note_id'";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $output->add("status", 1);
      $output->add("message", "Successfully deleted $rows note" . ($rows > 1 ? "s" : ""));
    } else {
      $output->add("error", "No matching notes were found to delete");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function update_note ($internal, $user_id, $note_id, $note_content) {
  $output = new Output;
  $output->add("message", "Add Note initialized");

  $db = new DB;

  $sql = "UPDATE notes SET note_content='$note_content' WHERE user_id=$user_id AND note_id=$note_id";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $output->add("status", 1);
      $output->add("message", "Successfully updated $rows note" . ($rows > 1 ? "s" : ""));
    } else {
      $output->add("error", "Note was not successfully updated");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function add_note ($internal, $user_id, $note) {
  $output = new Output;
  $output->add("message", "Add Note initialized");

  $db = new DB;

  $sql = "INSERT INTO notes (user_id, note_content) VALUES ('$user_id', '$note')";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $output->add("status", 1);
      $output->add("message", "Successfully added $rows note" . ($rows > 1 ? "s" : ""));
    } else {
      $output->add("error", "Note was not successfully added");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function get_notes ($internal, $user_id) {
  $output = new Output;
  $output->add("message", "Get Notes initialized");

  $db = new DB;

  $sql = "SELECT * FROM notes WHERE user_id='$user_id'";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;
    $notes = array();
    $output->add("status", 1);

    if ($rows > 0) {
      $output->add("rows", $rows);

      while ($row = $stmt->fetch_assoc()) {
        $note = array();

        foreach ($row as $key => $value) {
          $note[$key] = $value;
        }

        $notes[] = $note;
      }
      $output->add("message", "Successfully retrieved $rows notes");
    } else {
      $output->add("message", "No notes retrieved for $user_id");
    }

    $output->add("notes", $notes);
  } else {
    $output->add("error", $db::$conn->error);
  }


  return $output->return($internal);
}

function update_profile ($internal, $user_id, $first_name, $last_name, $email_address, $password) {
  $output = new Output;
  $output->add("message", "Update Profile initialized");

  $db = new DB;

  $hashedPassword = $password ? password_hash($password, PASSWORD_DEFAULT) : false;

  $sql = "UPDATE users SET ";
  $first_name && $sql .= "first_name='$first_name', ";
  $last_name && $sql .= "last_name='$last_name', ";
  $email_address && $sql .= "email_address='$email_address', ";
  $hashedPassword && $sql .= "password='$hashedPassword', ";
  $sql = substr($sql, 0, -2);
  $sql .= " WHERE user_id=$user_id";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $user = get_user(true, $user_id)["user"];
      $output->add("user", $user);
      $output->add("status", 1);
      $output->add("message", "Successfully updated user $user_id");
    } else {
      $output->add("error", "No users updated");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function get_user ($internal, $user_id) {
  $output = new Output;
  $output->add("message", "Get User initialized");

  $db = new DB;

  $sql = "SELECT * FROM users WHERE user_id=$user_id LIMIT 1";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $user = array();

      while ($row = $stmt->fetch_assoc()) {
        foreach ($row as $key => $val) {
          $user[$key] = $val;
        }
      }

      $output->add("user", $user);
      $output->add("status", 1);
      $output->add("message", "Successfully retrieved user $user_id");
    } else {
      $output->add("error", "No user found for $user_id");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function confirm_password ($internal, $user_id, $password) {
  $output = new Output;
  $output->add("message", "Confirm Password initialized");

  $db = new DB;

  $sql = "SELECT password FROM users WHERE user_id=$user_id";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $hashedPassword = $stmt->fetch_object()->password;

      if (password_verify($password, $hashedPassword)) {
        $output->add("status", 1);
        $output->add("message", "Successfully confirmed password");
      } else {
        $output->add("password", $password);
        $output->add("hashedPassword", $hashedPassword);
        $output->add("error", "Incorrect password");
      }
    } else {
      $output->add("error", "User $user_id not found");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function signin_user ($internal, $email_address, $password) {
  $output = new Output;
  $output->add("message", "Sign In User initialized");

  $db = new DB;

  $sql = "SELECT * FROM users WHERE email_address='$email_address'";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    if ($rows > 0) {
      $output->add("rows", $rows);
      $user = array();

      while ($row = $stmt->fetch_assoc()) {
        foreach ($row as $key => $value) {
          if ($key === "password") $hashedPassword = $row[$key];
          else $user[$key] = $value;
        }
      }

      if (password_verify($password, $hashedPassword)) {
        $output->add("user", $user);
        $output->add("status", 1);
        $output->add("message", "Successfully signed in as $email_address");
      } else {
        $output->add("error", "Incorrect password provided");
      }

    } else {
      $output->add("error", "User not found");
    }
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function register_user ($internal, $email_address, $password) {
  $output = new Output;
  $output->add("message", "Register User initialized");

  $db = new DB;

  $sql = "SELECT * FROM users WHERE email_address='$email_address'";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;
    if ($rows > 0) {
      $output->add("error", "This email address is already in use");
      $output->return(false);
      return;
    }
  }

  $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

  $sql = "INSERT INTO users (email_address, password) VALUES ('$email_address', '$hashedPassword')";

  if ($stmt = $db::$conn->query($sql)) {
    $rows = $db::$conn->affected_rows;

    $output->add("rows", $rows);
    $output->add("status", 1);
    $output->add("message", "Successfully registered $email_address");
  } else {
    $output->add("error", $db::$conn->error);
  }

  return $output->return($internal);
}

function destroy_user_cookie ($internal) {
  $output = new Output;
  $output->add("message", "Get User Cookie initialized");

  if (setcookie("noteboard_user")) {
    $output->add("status", 1);
    $output->add("message", "Successfully reset cookie");
  } else {
    $output->add("error", "Could not reset cookie");
  }

  return $output->return($internal);
}

function get_user_cookie ($internal) {
  $output = new Output;
  $output->add("message", "Get User Cookie initialized");

  $cookie = $_COOKIE["noteboard_user"];

  if ($cookie) {
    $user_id = substr($cookie, strpos($cookie, "=") + 1);
    $output->add("cookie", $_COOKIE["noteboard_user"]);
    $output->add("user", get_user(true, $user_id)["user"]);
    $output->add("status", 1);
    $output->add("message", "Successfully retrieved user cookie");
  } else {
    $output->add("error", "Could not retrieve user cookie");
  }

  return $output->return($internal);
}

function set_user_cookie ($internal, $user_id) {
  $output = new Output;
  $output->add("message", "Set User Cookie initialized");

  if (setcookie (
    "noteboard_user",
    "user_id=$user_id",
    time() + 60 * 60 * 24 * 7
  )) {
    $output->add("status", 1);
    $output->add("message", "Successfully wrote user cookie");
  } else {
    $output->add("error", "Could not write user cookie");
  }

  return $output->return($internal);
}

$output = new Output;

if (array_key_exists("action", $_POST)) {
  switch ($_POST["action"]) {
    case "get_user":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;

      if ($user_id) get_user(false, $user_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "get_user_cookie":
      get_user_cookie(false);
      break;

    case "set_user_cookie":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;

      if ($user_id) set_user_cookie(false, $user_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "destroy_user_cookie":
      destroy_user_cookie(false);
      break;

    case "register_user":
      $email_address = array_key_exists("email_address", $_POST) ? $_POST["email_address"] : false;
      $password = array_key_exists("password", $_POST) ? $_POST["password"] : false;

      if ($email_address && $password) register_user(false, $email_address, $password);
      else {
        $output->add("error", "Email address or password not provided");
        $output->return(false);
      }
      break;

    case "signin_user":
      $email_address = array_key_exists("email_address", $_POST) ? $_POST["email_address"] : false;
      $password = array_key_exists("password", $_POST) ? $_POST["password"] : false;

      if ($email_address && $password) signin_user(false, $email_address, $password);
      else {
        $output->add("error", "Email address or password not provided");
        $output->return(false);
      }
      break;

    case "update_profile":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $first_name = array_key_exists("first_name", $_POST) ? $_POST["first_name"] : false;
      $last_name = array_key_exists("last_name", $_POST) ? $_POST["last_name"] : false;
      $email_address = array_key_exists("email_address", $_POST) ? $_POST["email_address"] : false;
      $password = array_key_exists("password", $_POST) ? $_POST["password"] : false;

      if ($user_id) update_profile(false, $user_id, $first_name, $last_name, $email_address, $password);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "confirm_password":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $password = array_key_exists("password", $_POST) ? $_POST["password"] : false;

      if ($user_id && $password) confirm_password(false, $user_id, $password);
      else {
        $output->add("error", "No user ID and/or password provided");
        $output->return(false);
      }
      break;

    case "get_notes":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;

      if ($user_id) get_notes(false, $user_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "add_note":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $note = array_key_exists("note", $_POST) ? $_POST["note"] : false;

      if ($user_id) add_note(false, $user_id, $note);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "update_note":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $note_id = array_key_exists("note_id", $_POST) ? $_POST["note_id"] : false;
      $note_content = array_key_exists("note_content", $_POST) ? $_POST["note_content"] : false;

      if ($user_id && $note_id && $note_content) update_note(false, $user_id, $note_id, $note_content);
      else {
        $output->add("error", "No user ID and/or note ID and/or note content provided");
        $output->return(false);
      }
      break;

    case "delete_note":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $note_id = array_key_exists("note_id", $_POST) ? $_POST["note_id"] : false;

      if ($user_id) delete_note(false, $user_id, $note_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "get_files":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;

      if ($user_id) get_files(false, $user_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "add_file":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;

      if ($user_id) add_file(false, $user_id);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    case "delete_file":
      $user_id = array_key_exists("user_id", $_POST) ? $_POST["user_id"] : false;
      $file_name = array_key_exists("file_name", $_POST) ? $_POST["file_name"] : false;

      if ($user_id && $file_name) delete_file(false, $user_id, $file_name);
      else {
        $output->add("error", "No user ID provided");
        $output->return(false);
      }
      break;

    default:
      $output->add("message", "Action not recognized");
      $output->return(false);
      break;
  }
} else {
  $output->add("error", "No action provided");
  $output->return(false);
}

?>
