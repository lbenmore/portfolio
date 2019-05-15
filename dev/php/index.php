<?php 

class DB {
	public static $con;
	
	function __construct () {
		$server = "localhost";
		$username = "lisabe7";
		$password = "cobain612";
		$db = "lisabe7_noteboard";
		
		self::$con = new mysqli($server, $username, $password, $db);
	}
}

class Output {
	private static $arr;
	
	public static function add ($key, $value) {
		self::$arr[$key] = $value;
	}
	
	public static function return ($internal) {
		if ($internal) {
			return self::$arr;
		} else {
			echo json_encode(self::$arr);
		}
	}
}



function send_mail ($internal, $from, $subject, $body) {
	$output = new Output();
	$output->add("status", 0);
	$output->add("message", "init send_mail");
	
	$headers = "From: $from";
	
	if (mail("lbenmore@gmail.com", $subject, $body, $headers)) {
		$output->add("status", 1);
		$output->add("message", "Email successfully sent");
	} else {
		$output->add("message", "Email not sent");
	}
	
	$output->return($internal);		
}



$output = new Output();
$output->add("status", 0);

if (array_key_exists("action", $_POST)) {
	switch ($_POST["action"]) {
		case "send_email":
			send_mail(false, $_POST["from"], $_POST["subject"], $_POST["body"]);
		break;
		
		default:
			$output->add("message", "Action not recognized");
			$output->return(false);
		break;
	}
} else {
	$output->add("message", "No action provided");
	$output->return(false);
}

?>