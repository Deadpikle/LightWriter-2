<?php

    require_once '../init.php';

    if (!isset($_SESSION["UserID"])) {
        $result = array("status" => 401, "success" => FALSE);
        echo json_encode($result);
        die();
    }

    $data = getJSONFromPost();

    $patternID = -1;
    if (isset($data["patternID"]) && is_numeric($data["patternID"])) {
        $patternID = $data["patternID"];
    }
    $blocks = $data["blocks"];
    $name = $data["name"];
    $rules = $data["rules"];

    try {
        // new graph if graph ID is -1
        if ($patternID == -1) {
            $insert = "INSERT INTO SavedPatterns (UserID, GraphData, SettingsData, Name) VALUES (?, ?, ?, ?)";
            $params = [
                $_SESSION["UserID"],
                $blocks,
                $rules,
                $name
            ];
            $insertStmt = $pdo->prepare($insert);
            $insertStmt->execute($params);
            $result = array("status" => 200, "success" => TRUE, "patternID" => $pdo->lastInsertId());
        }
        else {
            // updating an old graph
            $update = "UPDATE SavedPatterns SET UserID = ?, GraphData = ?, SettingsData = ?, Name = ? WHERE SavedPatternID = ?";
            $params = [
                $_SESSION["UserID"],
                $blocks,
                $rules,
                $name,
                $patternID
            ];

            $updateStmt = $pdo->prepare($update);
            $updateStmt->execute($params);
            $result = array("status" => 200, "success" => TRUE, "patternID" => $pdo->lastInsertId());
        }
    }
    catch (Exception $e) {
        $result = array("status" => 500, "message" => $e);
    }
    echo json_encode($result);
?>