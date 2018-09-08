<?php 
require_once '../../config.php';
require_once(ROOT_DIR."/Scripts/function.php");
require_once(ROOT_DIR."/Classes/EsstCase.class.php");

if (isset($_POST['action'])){
	switch($_POST['action']){
		case 'saveCase':
			try{
                $newcase = USER_CASE_PATH.$_POST['Casename'];  
                if (!is_dir($newcase)){
                    $genData = EsstCase::createCaseStudy($_POST);
                    echo json_encode(array('msg'=>"New ESST Case Study with scenario has been created!", "type"=>"SUCCESS", "genData"=>$genData));
                }
                else{
                    echo json_encode(array('msg'=>"Case with same name already exists!", "type"=>"WARNING"));
                }
            }
            catch (exception $ex){
                echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
            }
		break;

        case 'editCase': 
            try{
                EsstCase::updateCaseStudy($_POST);
            }
            catch (exception $ex){
                echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
            }
        break;
		case 'updateCaseDescription': 
			$desc=$_POST['desc'];
			EsstCase::updateCaseDescription($desc,$_POST['case']);
			echo json_encode("Update of ESST case description done!") ;
		break;	
    }
}	
?>