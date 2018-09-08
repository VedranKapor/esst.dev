<?php
require_once("../../config.php");
require_once(ROOT_DIR."/Classes/EsstCase.class.php");
    
if (isset($_POST['action'])){
	switch($_POST['action']){
		default:
		break;	
		case 'getCases': //select cases
			$ps = EsstCase::getAllCaseStudies();
			echo json_encode($ps);
		break;
		case 'genData': //select cases
			$esstCase = new EsstCase($_POST['cs']);
			echo json_encode($esstCase->genData);
		break;
		case 'setSession': //update case desc
		try{
				if(isset($_SESSION['cs']))
					unset($_SESSION['cs']);
                $_SESSION['cs'] = $_POST['cs'];
                if(isset($_SESSION['sc']))
                    unset($_SESSION['sc']);
                $_SESSION['sc'] = $_POST['sc'];
				echo json_encode(array('msg'=>"Case study ".$_SESSION['cs']." set success!", "type"=>"SUCCESS",	"SESSION"=>$_SESSION));
				die(); 
		}
		catch(runtimeException $e){
			echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			die();
		}
		break;
		case 'getSession': //update case desc
			try{
				echo json_encode($_SESSION);
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		case 'resetSession': //update case desc
		try{
			session_destroy();
			echo json_encode(array('msg'=>"Session destroyed!", "type"=>"SUCCESS"));
		}
		catch(runtimeException $e){
			echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
		}
	}
}
?>