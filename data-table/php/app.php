<?php 
# local testing - update config at /opt/lampp/apache2/conf/httpd.conf

ini_set("display_errors", 1);
error_reporting(E_ALL);

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

function export_data ($internal, $matrix) {
    $output = new Output;
    $output->add("message", "Export Data initialiazed.");

    if (!is_dir("../tmp")) mkdir("../tmp");
    else $output->add("message", "tmp was a dir");

    $matrix = json_decode($matrix);
    $file_name = "../tmp/datatable.csv";
    $file = fopen($file_name, "w+");
    $content = "";

    foreach ($matrix as $row) {
        $content .= join(",", $row) . "\n";
    }
    
    fwrite($file, $content);
    fclose($file);

    $output->add("status", 1);
    $output->add("file_name", $file_name);
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