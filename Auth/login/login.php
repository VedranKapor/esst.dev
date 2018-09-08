<?php
/*
 * Password hashing with PBKDF2.
 * Author: havoc AT defuse.ca
 * www: https://defuse.ca/php-pbkdf2.htm
 */
require_once("../../config.php");
require_once("constants.php");
require_once("validate.php");
require_once("pbkdf2.php");

if (isset($_POST['action'])){
	switch($_POST['action']){	
		case 'login': //update case desc
			try{
                $username=$_POST['username'];
                $password=$_POST['password'];
                $users=array();

                $url='../us.json';
                $file = (file_get_contents($url));
                $users=json_decode($file, true);

                $login=false;
                for ($i=0; $i<count($users); $i++) {
                    if ($username==$users[$i]["username"]) {
                        $login=validate_password($password, $users[$i]["password"]);
                        if ($login){
                            $group=$users[$i]["usergroup"];
                        }
                    }
                }
                
                if ($login) {
                    $_SESSION['us'] = $username; 
                    $_SESSION['gr'] = $group; 
                    echo json_encode(array('msg'=>'Login success!', "type"=>"SUCCESS"));
                }else{
                    echo json_encode(array('msg'=>'Username or passowrd is incorect!', "type"=>"ERROR"));
                }
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
        break;
    }
}
?>