<?php

/////////////// Upload FILE CLASS ////////////////
//************************************************
//************************************************
//************** CREATED BY VK *******************
//************ message 20151118 ******************
///////////////////////////////////////////////////

class Upload {
    public static $SUCCESS = 'File is uploaded successfully.';
    public static $FILESIZE_ERROR = 'Exceeded filesize limit.';
    public static $INVALIDPARAMETERS_ERROR = 'Invalid parameters.';
    public static $UNKNOWN_ERROR = 'Unknown errors.';
    public static $INVALIDFORMAT_ERROR = 'Invalid file format.';
    public static $MOVE_ERROR = 'Failed to move uploaded file.';
    public static $FILEEXISTS_ERROR = 'Case already exists!';
    public static $NOTVALID_ESSTCASE = 'Case is not valid esst 3.0 case!';
    public static $FILE_SIZE = 1000000;
    private $UPLOAD_FOLDER;
    private $UPLOADED_FOLDER;
    private $UPLOAD_FILE;
    
    var $fieldname;
	var $type;
	var $upload_dir;
	private $filename;
    private $filenameNoExt;
	
	function __construct( $n_fieldname, $n_type, $n_upload_dir ){
		$this->fieldname = $n_fieldname;
		$this->type = $n_type;
		$this->upload_dir = $n_upload_dir;
		//$this->filename = $n_filename;
		//$this->uploaded();	
        $this->filename = $_FILES[$this->fieldname]["name"];
        //$this->UPLOAD_FOLDER = ROOT_DIR."/".$this->upload_dir;
        //$this->UPLOAD_FILE = ROOT_DIR."/".$this->upload_dir."/".$this->filename;
        $this->UPLOAD_FILE = TMP_PATH.$this->filename;
        $this->filenameNoExt = preg_replace('/\\.[^.\\s]{3,4}$/', '', $this->filename);
        //$this->UPLOADED_FOLDER = ROOT_DIR."/".$this->upload_dir."/".$this->filenameNoExt;
        $this->UPLOADED_FOLDER = USER_CASE_PATH.$this->filenameNoExt;
	}

	function uploaded(){
       try{
            // Undefined | Multiple Files | $_FILES Corruption Attack
            // If this request falls under any of them, treat it invalid.
            if (!isset($_FILES[$this->fieldname]['error']) || is_array($_FILES[$this->fieldname]['error'])){
                throw new RuntimeException(Upload::$INVALIDPARAMETERS_ERROR);
            }
            
            // Check $_FILES['upfile']['error'] value.
            switch ($_FILES[$this->fieldname]['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('No file sent.');
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException(Upload::$FILESIZE_ERROR);
                default:
                    throw new RuntimeException(Upload::$UNKNOWN_ERROR);
            }
        
            // You should also check filesize here.
            if ($_FILES[$this->fieldname]['size'] > Upload::$FILE_SIZE){
                throw new RuntimeException(Upload::$FILESIZE_ERROR);
            }
            // DO NOT TRUST $_FILES[$this->fieldname]['mime'] VALUE !!
            // Check MIME Type by yourself.
           // $ZIP = array('zip' => 'application/zip', 'rar' => 'application/x-rar');
           $ZIP = array('zip' => 'application/zip');
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            
            if (false === $ext = array_search($finfo->file($_FILES[$this->fieldname]['tmp_name']), $ZIP, true)){
                throw new RuntimeException(Upload::$INVALIDFORMAT_ERROR);
            }
            		
            if (!file_exists($this->UPLOADED_FOLDER))
            {
                if (!move_uploaded_file($_FILES[$this->fieldname]['tmp_name'], $this->UPLOAD_FILE)){
                    throw new RuntimeException(Upload::$MOVE_ERROR);
                }
                else{
                    $zip = new ZipArchive;
                    $path = $this->UPLOADED_FOLDER;
                    if ($zip->open($this->UPLOAD_FILE) === TRUE) {

                             //$esstTest = json_decode($zip->getFromName($this->filenameNoExt.'/genData.json'));
                             //kad nema folderz za zip vec pakuje direktno u arhivu
                             $esstTest = json_decode($zip->getFromName('genData.json'));
                             if($esstTest->General->Version == '3.0'){

                                $test = $zip->extractTo($path);
                                $zip->close();
                                chmod($this->UPLOAD_FILE,0777);
                                unlink($this->UPLOAD_FILE);

                                //izbrisi sve sto smo ranij restorali
                                $files = scandir(USER_CASE_PATH);
                                foreach ($files as $file) {
                                    if (preg_match('/.+\.zip$/', $file)) {	
                                        unlink(USER_CASE_PATH.$file);
                                    }
                                }
                             }
                             else{
                                 $zip->close();
                                 chmod($this->UPLOAD_FILE,0777);
                                 unlink($this->UPLOAD_FILE);
                                 throw new RuntimeException(Upload::$NOTVALID_ESSTCASE);
                             }
                    } 
                }
            }
            else{
                throw new RuntimeException(Upload::$FILEEXISTS_ERROR);
            }
        }
        catch (RuntimeException $e){
                //echo $e->getMessage();
                throw $e;
        }
	}
}
?>
