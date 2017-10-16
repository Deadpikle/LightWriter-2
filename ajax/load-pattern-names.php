<?php

    require_once '../init.php';

    if (!isset($_SESSION["UserID"])) {
        $result = array("status" => 401, "success" => FALSE);
        echo json_encode($result);
        die();
    }

    $query = "
    SELECT SavedPatternID, Name
    FROM SavedPatterns
    WHERE UserID = ?";
    $params = [
        $_SESSION["UserID"]
    ];

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $patterns = $stmt->fetchAll();
    $didOutput = FALSE;

    if (isset($patterns)) {
        $output = [];
        foreach ($patterns as $pattern) {
            $output[] = [
                "patternID" => $pattern["SavedPatternID"],
                "name" => $pattern["Name"]
            ];
        }
        $result = array ( "status" => 200, "success" => TRUE, "data" => $output);
    }
    if (!$didOutput) {  
        $result = array ("status" => 200, "success" => FALSE);
    }
    echo json_encode($result);
?>