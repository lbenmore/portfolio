<div class='content__board'>
  <?php
    $user_id = $_SESSION["user_id"];
    $username = $_SESSION["username"];
    $fullname = $_SESSION["fullname"];

    echo "
      <div class='board__welcome'>
        Hello, $fullname.
        <form method='POST' class='welcome__logout'>
          <button name='logout'>LOG OUT</button>
        </form>
      </div>
    ";

    $conn = connect_to_noteboard();

    if (isset($_POST["add_note"])) {
      $new_note = $_POST["new_note"];
      $query_new_note = "INSERT INTO notes (user_id, note) VALUES (\"$user_id\", \"$new_note\")";
      $create_new_note = $conn->query($query_new_note);
    }

    if (isset($_POST["delete_note"])) {
      $id = $_POST["delete_note"];

      $query_clear_all = "DELETE FROM notes WHERE id=\"$id\";";
      $conn->query($query_clear_all);
    }

    if (isset($_POST["clear_all"])) {
      $query_clear_all = "DELETE FROM notes WHERE user_id=\"$user_id\";";
      $conn->query($query_clear_all);
    }

    $get_current_notes = "SELECT * FROM notes WHERE user_id=\"$user_id\";";
    $get_notes_rows = $conn->query($get_current_notes);
    $notes_rows = $get_notes_rows->fetch_all(MYSQLI_ASSOC);

    echo "
      <div class='board__notes'>
    ";

    foreach($notes_rows as $note_array) {
      $note = $note_array["note"];
      $id = $note_array["id"];
      echo "<div class='notes__note'>$note <form method='POST' class='note__delete'><button name='delete_note' value='$id'>x</button></form></div>";
    }

    echo "
      </div>
    ";
  ?>

  <form class='board__edit' method='POST'>
    <input type='text' class='edit__input' name='new_note'><button class='edit__button edit__button--add' name='add_note'>ADD</button><button class='edit__button edit__button--delete' name='clear_all'>CLEAR ALL</button>
  </form>
</div>
