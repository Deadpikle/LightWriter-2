<?php
    require_once '../init.php';

    session_regenerate_id(FALSE);
    session_unset();

    $result = array ("status" => 200, "success" => TRUE);
    echo json_encode($result);
?>