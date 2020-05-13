<?php
  class Output {
    private static $arr = array();

    function add ($key, $value) {
      self::$arr[$key] = $value;
    }

    function return ($internal) {
      if ($internal) {
        return self::$arr;
      } else {
        echo json_encode(self::$arr);
      }
    }

    function __construct ($fn) {
      self::$arr["status"] = 0;
      self::$arr["function"] = $fn;
      self::$arr["message"] = self::$arr["function"] . " initialized";
    }
  }

  function upload_image ($internal, $directory, $file) {
    $output = new Output("upload_image");

    $fileName = $file["name"];
    $srcPath = $file["tmp_name"];
    $destPath = "$directory/$fileName";
    rename($srcPath, $destPath);
    chmod($destPath, 0777);

    $output->add("status", 1);
    $output->add("image", "$directory/$fileName");
    return $output->return($internal);
  }

  function create_directory ($internal, $directory) {
    $output = new Output("create_directory");

    $new_dir_name = "$directory/custom_upload_" . time();
    $new_directory = mkdir($new_dir_name);

    $output->add("status", 1);
    $output->add("directory", $new_dir_name);
    return $output->return($internal);
  }

  function get_directories ($internal, $directory) {
    $output = new Output("get_directories");

    $output->add("directory", $directory);
    
    $things = scandir($directory);
    $things = array_filter($things, function ($thing) use ($directory) {
      return substr($thing, 0, 1) !== "." && is_dir("$directory/$thing") === true;
    });
    $things = array_map(function ($thing) use ($directory) {
      return "$directory/$thing";
    }, $things);
    $things = array_values($things);
    $things = array_reverse($things);

    $output->add("directories", $things);
    $output->add("status", 1);
    return $output->return($internal);
  }

  function get_images ($internal, $directory) {
    $output = new Output("get_images");
    $output->add("directory", $directory);

    $files = scandir($directory);
    $images = array_filter($files, function ($item) use ($directory) {
      return substr($item, 0, 1) !== "." && 
        !is_dir("$directory/$item") &&
        exif_imagetype("$directory/$item") !== false;
    });
    $images = array_values($images);
    $output->add("images", $images);

    $output->add("status", 1);
    return $output->return($internal);
  }

  $output = new Output("Global");

  if (array_key_exists("action", $_POST)) {
    switch ($_POST["action"]) {
      case "get_images":
        $directory = array_key_exists("directory", $_POST) ? $_POST["directory"] : false;
        if ($directory) get_images(false, $directory);
        else {
          $output->add("error", "No directory provided for get_images action");
          return $output->return(false);
        }
      break;

      case "get_directories":
        $directory = array_key_exists("directory", $_POST) ? $_POST["directory"] : false;
        if ($directory) get_directories(false, $directory);
        else {
          $output->add("error", "No directory provided for get_directories action");
          return $output->return(false);
        }
      break;

      case "create_directory":
        $directory = array_key_exists("directory", $_POST) ? $_POST["directory"] : false;
        if ($directory) create_directory(false, $directory);
        else {
          $output->add("error", "No directory provided for create_directory action");
          return $output->return(false);
        }
      break;

      case "upload_image":
        $directory = array_key_exists("directory", $_POST) ? $_POST["directory"] : false;
        $file = array_key_exists("file", $_FILES) ? $_FILES["file"] : false;
        if ($directory && $file) upload_image(false, $directory, $file);
        else {
          $output->add("error", "No directory and/or file provided for upload_image action; $directory " . var_export($file, true));
          return $output->return(false);
        }
      break;

      default:
        $output->add("error", "Action provided not recognized");
        $output->add("POST", var_export($_POST, true));
        $output->return(false);
      break;
      
    }
  } else {
    $output->add("error", "No action provided");
    $output->add("POST", var_export($_POST, true));
    $output->return(false);
  }

?>