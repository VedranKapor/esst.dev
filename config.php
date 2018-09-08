<?php 
session_start();
define('ROOT_DIR', dirname(__FILE__)); 

define("INCLUDE_PATH", ROOT_DIR."/Includes/");
define("STORAGE_PATH", ROOT_DIR."/Storage/");
define("TMP_PATH", ROOT_DIR."/tmp/");

if(isset($_SESSION['us'])){
    define("USER_CASE_PATH", STORAGE_PATH. $_SESSION['us']."/" );
}
else{
    $_SESSION['us'] = 'admin';
    define("USER_CASE_PATH", STORAGE_PATH."/admin/" );
}
?>