<?php
    require_once '../init.php';

    if (isset($_SESSION['UserID'])) {
        $result = array ("status" => 200, "active" => TRUE);
    }
    else {
        $result = array ("status" => 200, "active" => FALSE);
    }
    echo json_encode($result);
?>