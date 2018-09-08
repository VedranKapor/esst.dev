<?php
require_once("../../config.php");
require_once(ROOT_DIR."/Classes/EsstCase.class.php");
require_once(ROOT_DIR."/Classes/Upload.class.php");
require_once(ROOT_DIR."/Scripts/function.php");

if (isset($_POST['action'])){
	switch($_POST['action']){
		default:
		break;
		case 'getCases': 
			$ps = EsstCase::getAllCaseStudies();
			echo json_encode($ps);
		break;
		case 'getDescription':
			//echo EsstCase::getCaseDescription($_POST['case']);
			$caseDesc = EsstCase::getCaseDescription($_POST['case']);
			echo json_encode(array('msg'=>"Description!", "type"=>"SUCCESS", "data"=> $caseDesc));	
		break;
		case 'updateCaseDescription': 
			$desc=$_POST['desc'];
			EsstCase::updateCaseDescription($desc,$_POST['case']);
			echo json_encode("Update of ESST case description done!") ;
		break;
		case 'updatePlanningStudy': 
			try{			
				$desc=$_POST['desc'];
				$pCase = $_POST['case'];
				$pCaseNew = $_POST['caseNew'];

				if(!is_dir(USER_CASE_PATH.$pCaseNew)|| $pCase == $pCaseNew){	
					EsstCase::updatePlanningStudy($pCase, $pCaseNew, $desc);	
					if( isset($_SESSION['cs']) && $_SESSION['cs'] == $pCase  && isset($_SESSION['sc']) && $_SESSION['sc'] == $pScenario ){
						$_SESSION['cs'] = $pCaseNew;
					}

					$ps = EsstCase::getAllCaseStudies();
					echo json_encode(array('msg'=>"Update of ESST case done!", "type"=>"SUCCESS", "data"=> $ps));
					//echo json_encode(array('msg'=>"Update of ESST case done!", "type"=>"SUCCESS"));	
				}

				else if (file_exists(USER_CASE_PATH.$pCaseNew.'/basic.json')){
					echo json_encode(array('msg'=>"Case study with same name exists!", "type"=>"WARNING"));
				}

			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		
		case 'updateScenarioName': 
			try{
				$pScenario = $_POST['scenario'];
				$pScenarioNew = $_POST['scenarioNew'];
				$pCase = $_POST['case'];
				if(!is_dir(USER_CASE_PATH.$pCase.'/'.$pScenarioNew)){
					EsstCase::renameScenario($pScenario, $pScenarioNew, $pCase);
					if( isset($_SESSION['cs']) && $_SESSION['cs'] == $pCase  && isset($_SESSION['sc']) && $_SESSION['sc'] == $pScenario ){
						$_SESSION['sc'] = $pScenarioNew;
					}
						
					$ps = EsstCase::getAllCaseStudies();
					echo json_encode(array('msg'=>"Update of ESST scenario done!", "type"=>"SUCCESS", "data"=> $ps));
					//echo json_encode(array('msg'=>"Update of ESST scenario done!", "type"=>"SUCCESS"));
				}
				else{
					echo json_encode(array('msg'=>"Scenario with same name exists!", "type"=>"WARNING"));
				}
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		case 'backupCase': 
			EsstCase::backupCaseTest($_POST['case']);
			echo json_encode(array('msg'=>"Backup done!", "type"=>"SUCCESS", 'zip' => $_POST['case']));
			//echo json_encode(array('zip' => $_POST['case']));
		break;
		
		case 'downloadCase': 
			header("Location: ../../Storage/".$_GET['case'].".zip");
			echo json_encode($_GET['case']);
			exit;
		break;
		
		case 'copyCase': 
			try{
				$srcFolder = realpath(USER_CASE_PATH.$_POST['case']);
				$dstFolder = USER_CASE_PATH.$_POST['case']."_copy";
				$i = 0;
				while (file_exists($dstFolder)) {	
					$i++;
					$unique = "($i)";
					$dstFolder = $dstFolder . $unique;
				}
				recurseCopy($srcFolder,$dstFolder);
				EsstCase::updateCaseName(basename($dstFolder));
				$ps = EsstCase::getAllCaseStudies();
				echo json_encode(array('msg'=>"Copy of case done!", "type"=>"SUCCESS", "data"=> $ps));
				//echo json_encode(array('msg'=>"Copy of case done!", "type"=>"SUCCESS"));	
			}
			catch(runtimeException $e){	
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));	
			}	
		break;
		case 'copyScenario':
			try{	
				$srcFolder = realpath(USER_CASE_PATH.$_POST['case'].'/'.$_POST['scenario']);
				$dstFolder = USER_CASE_PATH.$_POST['case'].'/'.$_POST['scenario']."_copy";
				$i = 0;
				while (file_exists($dstFolder)) {	
					$i++;
					$unique = "($i)";
					$dstFolder = $dstFolder . $unique;
				}
				recurseCopy($srcFolder,$dstFolder);
				$ps = EsstCase::getAllCaseStudies();
				echo json_encode(array('msg'=>"Copy of scenario done!", "type"=>"SUCCESS", "data"=> $ps));
				//echo json_encode(array('msg'=>"Copy of scenario done!", "type"=>"SUCCESS"));
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		case 'deleteStudy': 
			try{
				deleteDir(USER_CASE_PATH.$_POST['case']);
				if(isset($_SESSION['cs'] )  && $_SESSION['cs'] == $_POST['case']){
					unset($_SESSION['cs']);
					unset($_SESSION['sc']);
				}
				$ps = EsstCase::getAllCaseStudies();
				echo json_encode(array('msg'=>"Delete success!", "type"=>"SUCCESS", "data"=> $ps));
				//echo json_encode(array('msg'=>"Delete success!", "type"=>"SUCCESS"));
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		case 'deleteScenario': 
			try{
				deleteDir(USER_CASE_PATH.$_POST['case'].'/'.$_POST['scenario']);
				if( isset($_SESSION['sc']) && isset($_SESSION['cs'])  && $_SESSION['cs'] == $_POST['case']  && $_SESSION['sc'] == $_POST['scenario']){
					unset($_SESSION['cs']);
					unset($_SESSION['sc']);
				}
				$ps = EsstCase::getAllCaseStudies();
				echo json_encode(array('msg'=>"Delete success!", "type"=>"SUCCESS", "data"=> $ps));
				//echo json_encode(array('msg'=>"Delete success!", "type"=>"SUCCESS"));	
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;

		case 'createScenario': 
			try{
				$pCase = $_POST['case'];
				$pScenario = $_POST['scenario'];
				if (!file_exists(USER_CASE_PATH.$pCase.'/'.$pScenario)) {
					EsstCase::createScenario($pCase, $pScenario);
					$ps = EsstCase::getAllCaseStudies();
					echo json_encode(array('msg'=>"New scenario has been created!", "type"=>"SUCCESS", "data"=> $ps));
				}
				else{
					echo json_encode(array('msg'=>"Scenario with same name exists!", "type"=>"WARNING"));
				}
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
	}
}

if(isset($_FILES) && !empty($_FILES)){
	try{
		$upload = new Upload('fileToUpload', 'application/zip', 'Storage' );
		$msg = $upload->uploaded();
		$ps = EsstCase::getAllCaseStudies();
		echo json_encode(array('msg'=>"Upload success!", "type"=>"SUCCESS", "data"=> $ps));
	}
	catch (RuntimeException $ex){
		echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
	}
}
?>