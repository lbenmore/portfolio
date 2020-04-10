<?php
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
  date_default_timezone_set('America/Los_Angeles');

  class Output {
    public $output = array();

    function add ($key, $value) {
      $this->output[$key] = $value;
    }

    function trace () {
      echo json_encode($this->output);
    }

    function init () {
      $this->add("action", $_POST["action"]);
    }
  }

  function save_data_to_csv ($data) {
    $output = new Output;
    $output->init();

    $t = time();
    $json = json_decode($data);

    if (!is_dir("../output")) {
      mkdir("../output");
    }

    $csv = fopen("../output/$t.csv", "a+");
    $firstRun = true;

    foreach ($json as $row) {
      if ($firstRun) {
        $arr_headers = array();

        foreach ($row as $prop => $val) {
          array_push($arr_headers, $prop);
        }

        fputcsv($csv, $arr_headers);

        $firstRun = false;
      }

      $arr_row_values = array();
      $all_empties = true;

      foreach ($row as $prop => $val) {
        array_push($arr_row_values, $val);
        if ($val != "") $all_empties = false;
      }

      if (!$all_empties) fputcsv($csv, $arr_row_values);
    }

    fclose($csv);

    $output->add("file_name", "$t.csv");

    $output->trace();
  }

  function convert_csv_to_json ($file) {
    $output = new Output;
    $output->init();

    if ($file_contents = fopen($file["tmp_name"], "r")) {
      $headers = fgetcsv($file_contents);
      $json = array();

      while ( $row = fgetcsv($file_contents) ) {
        $tmp_row = array();
        foreach($row as $i => $value) {
          $tmp_row[$headers[$i]] = $value;
        }
        $json[] = $tmp_row;
      }

      fclose($file_contents);

      $output->add("data", json_encode($json));
      $output->add("headers", json_encode($headers));
    } else {
      $output->add("error", "No file contents");
    }

    $output->trace();
  }

  function runlink ($path) {
    $output = new Output;
    $output->init();

    $items = scandir($path);

    foreach ($items as $item) {
      if ($item != "." && $item != "..") {
        if (is_dir($item)) {
          runlink("$path/$item");
          unlink($item);
          $output->add($item, "runlinked");
        } else {
          unlink("$path/$item");
          $output->add($item, "deleted");
        }
      }
    }

    $output->trace();
  }

  switch ($_POST["action"]) {
    case "export_data":
      save_data_to_csv($_POST["data"]);
    break;

    case "import_data":
      convert_csv_to_json($_FILES["file"]);
    break;

    case "clean_up":
      runlink($_POST["folder_path"]);
    break;

    default:
      $output = new Output;
      $output->init();
      $output->add("error", "Selected action not defined");
      $output->add("post_dump", var_export($_POST, true));
      $output->trace();
    break;
  }
?>
