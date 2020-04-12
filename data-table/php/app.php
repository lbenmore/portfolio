<?php 

class Output {
    private static $arr = array();

    function add ($key, $value) {
        self::$arr[$key] = $value;
    }

    function return ($internal) {
        if ($internal) return self::$arr;
        else echo json_encode(self::$arr, true);
    }

    function __construct () {
        self::$arr["status"] = 0;
        self::$arr["message"] = "Output initialized.";    
    }
}

function import_data ($internal, $file) {
    $output = new Output;
    $output->add("message", "Import Data initialized");

    $file_name = $file["tmp_name"];
    $file_contents = file_get_contents($file_name);

    $matrix = array();
    $rows = explode("\n", $file_contents);

    foreach ($rows as $row) {
        if (!empty($row)) {
            $row_array = array();
            $cells = explode(",", $row);
            
            foreach ($cells as $cell) {
                $row_array[] = $cell;
            }

            $matrix[] = $row_array;
        }
    }

    $output->add("matrix", $matrix);

    $output->add("status", "1");
    return $output->return($internal);
}

function cleanup_tmp ($internal) {
    $output = new Output;
    $output->add("message", "Cleanup TMP initialized.");

    $path = "../tmp";

    $files = scandir($path);
    foreach ($files as $file) {
        if (substr($file, 0, 1) === ".") continue;
        unlink("$path/$file");
    }
    rmdir($path);

    $output->add("status", 1);
    $output->add("message", "Successfully removed temporary files.");

    return $output->return($internal);
}

function export_data ($internal, $matrix) {
    $output = new Output;
    $output->add("message", "Export Data initialiazed.");

    $dir_name = "tmp";
    $file_name = "data-table.csv";

    if (!is_dir("../$dir_name")) mkdir("../$dir_name");

    $matrix = json_decode($matrix);
    $file_path = "../$dir_name/$file_name";
    $file = fopen($file_path, "w+");
    $content = "";

    foreach ($matrix as $row) {
        $content .= join(",", $row) . "\n";
    }
    
    fwrite($file, $content);
    fclose($file);

    $output->add("status", 1);
    $output->add("message", "Data table has successfully exported. File should begin downloading soon.");
    $output->add("file_name", "$dir_name/$file_name");
    return $output->return($internal);
}

$output = new Output;
$output->add("message", "Global output initialized.");

if (array_key_exists("action", $_POST)) {
    switch ($_POST["action"]) {
        case "export_data":
            $matrix = array_key_exists("matrix", $_POST) ? $_POST["matrix"] : false;

            if ($matrix) export_data(false, $matrix);
            else {
                $output->add("error", "Matrix data not received.");
                return $output->return(false);
            }
        break;

        case "import_data":
            $file = array_key_exists("file", $_FILES) ? $_FILES["file"] : false;

            if ($file) import_data(false, $file);
            else {
                $output->add("error", "No file was provided.");
                return $output->return(false);
            }
        break;

        case "cleanup_tmp":
            cleanup_tmp(false);
        break;

        default:
            $output->add("error", "Action provided not recognized.");
            return $output->return(false);
        break;
    }
} else {
    $output->add("error", "No action provided");
    return $output->return(false);
}

?>