<?php
session_start();
    if(isset($_GET['case'])){
        //echo "sesije " . $_SESSION['us'];
        header("Location: ../Storage/" .$_SESSION['us'] . '/' .$_GET['case'].".zip");
        // header("Location: ../App/Model/".$_GET['case'].".zip");
        echo json_encode($_GET['case']);
        exit;
    }
?>