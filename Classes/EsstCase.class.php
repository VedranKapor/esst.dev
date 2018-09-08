<?php 
class EsstCase{
    public function __construct($pCase){    
        if (!isset($this->genData)) {
            $getDataurl = USER_CASE_PATH.$pCase."/genData.json";
            if (file_exists($getDataurl)){
                $getDataFile = file_get_contents( $getDataurl );
                $this->genData = json_decode($getDataFile, true);;
            }
        }
	}

    //return all case studies in array form
	public static function getAllCaseStudies(){
		if ($handle = opendir(USER_CASE_PATH)) {
			$caseStudies = array();
            $i=0;
			while (false !== ($file = readdir($handle))) {
				if($file != '.' && $file != '..' && is_dir(USER_CASE_PATH.$file)){
    				$caseStudies[$i]['title'] = $file;
                    $caseStudies[$i]['type'] = 'ps';  
                   	if ($handlecs = opendir(USER_CASE_PATH.$file)) {
                   	   $case=array();
                       $j=0;
                        while (false !== ($filecs = readdir($handlecs))) {
				            if($filecs != '.' && $filecs != '..' && is_dir(USER_CASE_PATH.$file.'/'.$filecs)){ 
				                $case[$j]['title']=$filecs;
                                $case[$j]['type']='cs';
                                $j++;
                            }
                        }
                         $caseStudies[$i]['ncs']=$j;
                         $caseStudies[$i]['cs'] = $case;  
                         closedir($handlecs);    
                    }   
                    $i++;                
				}  
			}
 			return $caseStudies;
			closedir($handle);
		}
		return false;
    }
    
        //return all case studies in array form
	public static function getAllScenarioByCaseStudy($pCaseStudy){
        if ($handle = opendir(USER_CASE_PATH.$pCaseStudy)) {
            $scenarios=array();
            while (false !== ($filecs = readdir($handle))) {
		        if($filecs != '.' && $filecs != '..' && is_dir(USER_CASE_PATH.$pCaseStudy.'/'.$filecs)){ 
		            $scenarios[]=$filecs;
                }
            } 
            closedir($handle);    
        }   
	    return $scenarios;
    }
    
    //get genData
    private static function getGenData($pCaseStudy){
        $getDataurl = USER_CASE_PATH.$pCaseStudy."/genData.json";
        if (file_exists($getDataurl)){
            $getDataFile = file_get_contents( $getDataurl );
            $genData = json_decode($getDataFile, true);
        }
        return $genData; 
    }
    
    //read planning study description
    public static function getCaseDescription($pCase){
        $getDataurl = USER_CASE_PATH.$pCase."/genData.json";
        if (file_exists($getDataurl)){
            $getDataFile = file_get_contents( $getDataurl );
            $retval = json_decode($getDataFile, true);
        }
        return $retval['General']['Description']; 
    }

    //update planning study description
   	public static function updateCaseDescription($pDesc, $pCase){
        if(isset($pDesc)){
            $getDataurl = USER_CASE_PATH.$pCase."/genData.json";
            if (file_exists($getDataurl)){
                $getDataFile = file_get_contents( $getDataurl );
                $retval = json_decode($getDataFile, true);
                $retval['General']['Description'] = $pDesc;
                $fp = fopen($getDataurl, 'w');
                fwrite($fp, json_encode($retval, JSON_PRETTY_PRINT));
                fclose($fp);
            }
			return true;
        }
   }

    public static function createCaseStudy($pPost){
        if(isset($pPost)){
            try{         
                $newCasePath = USER_CASE_PATH.$pPost['Casename'];  
                if (!is_dir($newCasePath)){
                    mkdir($newCasePath, 0777, true);
                }
                $genData = EsstCase::createGenData($pPost, $newCasePath);
                $nScenarioName = $pPost['Scenarioname'];
                $nScenarioPath = USER_CASE_PATH.$pPost['Casename']."/".$nScenarioName;
                if (!is_dir($nScenarioPath)){
                    mkdir($nScenarioPath, 0777, true);
                }
                EsstCase::createFedSectors($genData['Sector'], $genData['Year'], $nScenarioPath);
                EsstCase::createFedFuelShares($genData['Sector'], $genData['Year'], $genData['Commodity'], $nScenarioPath);
                return $genData;
            }
            catch (exception $ex){
                throw $ex;
            }
        }
    }

    public static function updateCaseStudy($pPost){
        if(isset($pPost)){
            try{         
                $newCasePath = USER_CASE_PATH.$pPost['Casename'];  
                if ( !file_exists ( $newCasePath  ) ) {
                    EsstCase::renameCase($pPost['CasenameHidden'], $pPost['Casename']);
                }
                $genData = EsstCase::createGenData($pPost, $newCasePath);
    
                $nScenarios = EsstCase::getAllScenarioByCaseStudy($pPost['Casename']);

                foreach($nScenarios as  $nSc){
                    $nScenarioPath = USER_CASE_PATH.$pPost['Casename'].'/'.$nSc;
                    EsstCase::createFedSectors($genData['Sector'], $genData['Year'], $nScenarioPath);
                    EsstCase::createFedFuelShares($genData['Sector'], $genData['Year'], $genData['Commodity'], $nScenarioPath);
                }
                $_SESSION['cs'] = $pPost['Casename'];//ukoliko smo mijenjali ime studije potrebno je resteovati sesiju jer je uptavo ta case st=udija iabrana prilikom edita
                echo json_encode(array('msg'=>"ESST case is updated!", "type"=>"SUCCESS"));
            }
            catch (exception $ex){
                throw $ex;
            }
        }
    }
    

    //update planning study description
   	private static function createGenData($pPost, $pCasePath){
        if(isset($pPost)){
			try{
                $genData['General']['Casename'] = $pPost['Casename'];
                $genData['General']['Type'] = $pPost['Type'];
                $genData['General']['Description'] = $pPost['Description'];
                $genData['General']['Date'] = $pPost['Date'];
                $genData['General']['Currency'] = $pPost['Currency'];
                $genData['General']['Unit'] = $pPost['Unit'];
                $genData['General']['Version'] = '3.0';
                $genData['Year'] = array_keys($pPost['Year']);
                $genData['Sector'] = array_keys($pPost['Sector']);
                $genData['Commodity'] = array_keys($pPost['Commodity']);
                $genData['Technology'] = array_keys($pPost['Technology']);

                $fp = fopen($pCasePath.'/genData.json', 'w');
                fwrite($fp, json_encode($genData, JSON_PRETTY_PRINT));
                fclose($fp);

                return $genData;
            }
            catch (exception $ex){
                throw $ex;
            }
        }
    }

    private static function createFedFuelShares($pSectors, $pYears, $pCommodity, $pPath){
        try{
            $i = 0;
            foreach($pSectors as $sec){
                $FedFuelShares[$i]['Sector'] = $sec;
                $j = 0;
                foreach($pCommodity as $tech){
                    foreach($pYears as $yr){
                        $tmp['Commodity'][$j][$yr] = 0;
                    }
                    $tmp['Commodity'][$j]['Fuel'] = $tech;
                    $j++;
                }
                $FedFuelShares[$i]['Share'] = $tmp;
                $i++;
            }
            $fp = fopen($pPath.'/FedFuelShares.json', 'w');
            fwrite($fp, json_encode($FedFuelShares, JSON_PRETTY_PRINT));
            fclose($fp);
        }
        catch (exception $ex){
            throw $ex;
        }
    }

    private static function createFedSectors($pSectors, $pYears, $pPath){
        try{
            $i = 0;
            foreach($pSectors as $sec){
                foreach($pYears as $yr){
                    $FedSectors[$i][$yr] = 0;
                }
                $FedSectors[$i]['Sector'] = $sec;
                $i++;
            }
            $fp = fopen($pPath.'/FEDSectors.json', 'w');
            fwrite($fp, json_encode($FedSectors, JSON_PRETTY_PRINT));
            fclose($fp);
        }
        catch (exception $ex){
            throw $ex;
        }
    }

    private static function updateFedSectors($pSectors, $pYears, $pPath){
        try{
            $FedSectors = json_decode(file_get_contents( $pPath.'/FEDSectors.json' ), true);
            $i = 0;
            foreach($pSectors as $sec){
                foreach($pYears as $yr){
                    $nFedSectors[$i][$yr] = $FedSectors[$i][$yr];
                }
                $nFedSectors[$i]['Sector'] = $sec;
                $i++;
            }
            $fp = fopen($pPath.'/FEDSectors.json', 'w');
            fwrite($fp, json_encode($nFedSectors, JSON_PRETTY_PRINT));
            fclose($fp);
        }
        catch (exception $ex){
            throw $ex;
        }
    }

    private static function updateFedFuelShares($pSectors, $pYears, $pCommodity, $pPath){
        try{
            $FedFuelShares = json_decode(file_get_contents( $pPath.'/FedFuelShares.json' ), true);
            $i = 0;
            foreach($pSectors as $sec){
                $nFedFuelShares[$i]['Sector'] = $sec;
                $j = 0;
                foreach($pTech as $tech){
                    foreach($pYears as $yr){
                        $tmp['Commodity'][$j][$yr] = $FedFuelShares[$i]['Share'] ['Commodity'][$j][$yr];
                    }
                    $tmp['Commodity'][$j]['Fuel'] = $tech;
                    $j++;
                }
                $nFedFuelShares[$i]['Share'] = $tmp;
                $i++;
            }
            $fp = fopen($pPath.'/FedFuelShares.json', 'w');
            fwrite($fp, json_encode($nFedFuelShares, JSON_PRETTY_PRINT));
            fclose($fp);
        }
        catch (exception $ex){
            throw $ex;
        }
    }

    //update planning study 
   	public static function updatePlanningStudy($pCase, $pCaseNew, $pDesc){
        $getDataurl = USER_CASE_PATH.$pCase."/genData.json";
        if (file_exists($getDataurl)){
            $getDataFile = file_get_contents( $getDataurl );
            $retval = json_decode($getDataFile, true);
            $retval['General']['Casename'] = $pCaseNew;
            $retval['General']['Description'] = $pDesc;
            $fp = fopen($getDataurl, 'w');
            fwrite($fp, json_encode($retval, JSON_PRETTY_PRINT));
            fclose($fp);
            rename(USER_CASE_PATH.$pCase, USER_CASE_PATH.$pCaseNew);
        }
		return true;
   }

    //rename case
   	public static function renameCase($pCase, $pCaseNew){
        rename(USER_CASE_PATH.$pCase, USER_CASE_PATH.$pCaseNew);
		return true;  
   }

    //rename scenario
    public static function renameScenario($pScenario, $nScenario, $ps){
        rename(USER_CASE_PATH.$ps.'/'.$pScenario, USER_CASE_PATH.$ps.'/'.$nScenario);
		return true;
   }

    //update case studz name in gendata.json
   	public static function updateCaseName($pCase){
        rename(USER_CASE_PATH.$pCase, USER_CASE_PATH.$pCase);
        $getDataurl = USER_CASE_PATH.$pCase."/genData.json";
        if (file_exists($getDataurl)){
            $getDataFile = file_get_contents( $getDataurl );
            $retval = json_decode($getDataFile, true);
            $retval['General']['Casename'] = $pCase;
            $fp = fopen($getDataurl, 'w');
            fwrite($fp, json_encode($retval, JSON_PRETTY_PRINT));
            fclose($fp);
        }
		return true;  
   }

    //create new scenario
   	public static function createScenario($pCase, $pScenario){   
        if(isset($pCase)){
            try{         
                $nScenarioPath = USER_CASE_PATH.$pCase.'/'.$pScenario;  
                if ( !file_exists ( $nScenarioPath  ) ) {
                    mkdir($nScenarioPath, 0777, true);
                    $genData = EsstCase::getGenData($pCase);
                    EsstCase::createFedSectors($genData['Sector'], $genData['Year'], $nScenarioPath);
                    EsstCase::createFedFuelShares($genData['Sector'], $genData['Year'], $genData['Technology'], $nScenarioPath);
                }
                return true;
                //echo json_encode(array('msg'=>"New esst case created!", "type"=>"SUCCESS"));
            }
            catch (exception $ex){
                throw $ex;
            }
        }
    }
        // $scenarioFolder = USER_CASE_PATH.$pCase."/".$pScenario;
        // if (!is_dir($scenarioFolder)){
        //     if($pCopy == 'false'){
        //         mkdir($scenarioFolder, 0777, true);
        //         return true;
        //     }
        //     else{
        //         $scenarioFolderCopy = USER_CASE_PATH.$pCase."/".$pScenarioCopy;
        //         $source = USER_CASE_PATH.$pCase."/".$pScenarioCopy;
        //         $dest = USER_CASE_PATH.$pCase."/".$pScenario;
        //         mkdir($dest, 0755);
        //         foreach ($iterator = new \RecursiveIteratorIterator(
        //             new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
        //             \RecursiveIteratorIterator::SELF_FIRST) as $item) {
        //                 if ($item->isDir()) {
        //                     mkdir($dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
        //                 } 
        //                 else {
        //                     copy($item, $dest . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
        //                 }
        //         }
        //         return true;
        //     }
        // }
        // else
		//     return "Scenario exists!";
  // }

   private static function deleteDir($path) {
        if (empty($path)) { 
            return false;
        }
        return is_file($path) ?
                @unlink($path) :
                array_map(__FUNCTION__, glob($path.'/*')) == @rmdir($path);
    }
    
   //backup planning study 
    // public static function backupCaseTest($pCase){
    //     if(isset($pCase)){
    //         $path = USER_CASE_PATH.$pCase;
    //         function archive($path) {

    //             $rootPath = realpath($path);
    //             $zip = new ZipArchive();
    //             $zip->open($rootPath.'.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);

    //             // Create recursive directory iterator

    //             $files = new RecursiveIteratorIterator(
    //                 new RecursiveDirectoryIterator($rootPath, FilesystemIterator::SKIP_DOTS),
    //                 RecursiveIteratorIterator::SELF_FIRST
    //             );

    //             foreach ($files as $name => $file){
    //                 if (!$file->isDir()){
    //                     $filePath = $file->getRealPath();
    //                     $relativePath = substr($filePath, strlen($rootPath) + 1);
    //                     $zip->addFile($filePath, basename($path). '/'. $relativePath);
    //                 }
    //                 else{
    //                     archive($name);
    //                 }
    //             }
    //             $zip->close();
    //         }
    //         archive($path);
    //     }
    // }




//RADIIIIIIIIIII!!!!
    public static function backupCaseTest_radi($pCase){
         $source = USER_CASE_PATH.$pCase;
         $destination = USER_CASE_PATH.$pCase . ".zip";

         if (!extension_loaded('zip') || !file_exists($source)) {
            return false;
        }
    
        $zip = new ZipArchive();
        if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
            return false;
        }
    
        $source = str_replace('/', '\\',realpath($source));
    
        if (is_dir($source) === true)
        {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);
    
            foreach ($files as $file)
            {
                $file = str_replace( '/', '\\',$file);
    
                // Ignore "." and ".." folders
                if( in_array(substr($file, strrpos($file, '\\')+1), array('.', '..')) )
                    continue;
    
                $file = realpath($file);
    
                if (is_dir($file) === true)
                {
                    $zip->addEmptyDir(str_replace($source . '\\', '', $file . '\\'));
                }
                else if (is_file($file) === true)
                {
                    $zip->addFromString(str_replace($source . '\\', '', $file), file_get_contents($file));
                }
            }
        }
        else if (is_file($source) === true)
        {
            $zip->addFromString(basename($source), file_get_contents($source));
        }
    
        return $zip->close();
    }




    public static function backupCaseTest($pCase){

         $source = realpath(USER_CASE_PATH.$pCase);
         $destination = USER_CASE_PATH.$pCase . ".zip";

        $zip = new ZipArchive();
        $zip->open($destination, ZipArchive::CREATE | ZipArchive::OVERWRITE);
         
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            foreach ($files as $file){
                $file = realpath($file);
    
                if (is_dir($file) === true){
                    $zip->addEmptyDir(  str_replace($source . '\\', '', $file . '\\'));
                }
                else if (is_file($file) === true){
                    $zip->addFromString( str_replace($source . '\\', '', $file), file_get_contents($file));
                }
            }
    
        return $zip->close();
    }
}

// require_once '../config.php';
// $hData = new EsstCase('Demo Case');

// echo "scenarios";
// echo "<pre>";
// print_r( $hData->getAllScenarioByCaseStudy('test2_copy') );
// echo "</pre>";

                // echo 'post';
                // echo "<pre>";
                // print_r($genData['Sector']);
                // echo "</pre>";
?>