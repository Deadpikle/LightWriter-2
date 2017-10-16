<?php

    require_once '../init.php';

    if (!isset($_SESSION["UserID"])) {
        $result = array("status" => 401, "success" => FALSE);
        echo json_encode($result);
        die();
    }

    $data = getJSONFromPost();

    $query = "
        SELECT SavedPatternID, Name, PatternData, SettingsData
        FROM SavedPatterns
        WHERE UserID = ? AND SavedPatternID = ?";
    $params = [
        $_SESSION["UserID"],
        $data["patternID"]
    ];

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $row = $stmt->fetch();
    $didOutput = FALSE;

    if (isset($row)) {
        $result = array ( "status" => 200, 
                          "success" => TRUE, 
                          "name" => $row["Name"], 
                          "pattern" => $row["PatternData"], 
                          "settings" => $row["SettingsData"]);
        $didOutput = TRUE;
    }
    if (!$didOutput) {  
        $result = array ("status" => 200, "success" => FALSE);
    }
    echo json_encode($result);
?>