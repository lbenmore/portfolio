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

$db = new DB();

$sql = "SELECT * FROM users";
if ($stmt = $db::$con->query($sql)) {
	while ($row = $stmt->fetch_assoc()) {
		echo $row;
	}
}

?>