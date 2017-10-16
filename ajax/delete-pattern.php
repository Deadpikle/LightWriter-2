<?php

    require_once '../init.php';

    if (!isset($_SESSION["UserID"])) {
        $result = array("status" => 401, "success" => FALSE);
        echo json_encode($result);
        die();
    }

    $data = getJSONFromPost();

    $query = "
        DELETE FROM SavedPatterns WHERE UserID = ? AND SavedPatternID = ?";
    $params = [
        $_SESSION["UserID"],
        $data["patternID"]
    ];

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $result = array ( "status" => 200, "success" => TRUE);
    
    echo json_encode($result);
?>