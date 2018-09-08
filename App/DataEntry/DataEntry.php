<?php
require_once("../../config.php");
require_once(ROOT_DIR."/Classes/EsstCase.class.php");
    
if (isset($_GET['action'])){
	switch($_GET['action']){
		default:
		break;	
		case 'genData':
			$esstCase = new EsstCase($_GET['cs']);
            echo json_encode($esstCase->genData);
            die();
        break;
		case 'saveData': 
			try{
                $data = file_get_contents('php://input'); 
                $data = json_decode($data, true); 
        
                $fp = fopen(USER_CASE_PATH.$_GET['cs'].'/' .$_GET['sc'].'/FEDSectors.json', 'w');
                fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
                fclose($fp);
                echo json_encode(array('msg'=>"Data have been saved!", "type"=>"SUCCESS"));
			}
			catch(runtimeException $e){
				echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
			}
		break;
		case 'SaveNestedData': 
		try{            
            $data = file_get_contents('php://input'); 
            $data = json_decode($data, true); 
    
            $json = file_get_contents(USER_CASE_PATH.$_GET['cs'].'/' .$_GET['sc']."/FEDFuelShares.json");
            $array = json_decode($json, true);
            
            $array[$_GET['id']]['Share']['Commodity'] = $data;
    
            $fp = fopen(USER_CASE_PATH.$_GET['cs'].'/' .$_GET['sc'].'/FEDFuelShares.json', 'w');
            fwrite($fp, json_encode($array, JSON_PRETTY_PRINT));
            fclose($fp);
			echo json_encode(array('msg'=>"Data shares have been saved!", "type"=>"SUCCESS"));
		}
		catch(runtimeException $e){
			echo json_encode(array('msg'=>$ex->getMessage(), "type"=>"ERROR"));
		}
	}
}
?>