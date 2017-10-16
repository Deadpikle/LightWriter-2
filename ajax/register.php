<?php
    require_once '../init.php';

    $data = getJSONFromPost();

    $username = $data['username'];
    $password = $data['password'];

    // step 1: make sure user with that username doesn't already exist

    $query = "
    SELECT UserID, Username, u.Password
    FROM Users u
    WHERE Username = ?";
    $params = [
        $username
    ];

    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $row = $stmt->fetch();
    
        if (isset($row) && $row !== FALSE) {
            var_dump($row);
            $result = array ("status" => 200, "success" => FALSE, "error" => "Account already exists");
            echo json_encode($result);
        }
        else {
            // create the user and log them in
            $insert = "INSERT INTO Users (Username, Password) VALUES (?, ?)";
            $params = [
                $username, 
                password_hash($password, PASSWORD_DEFAULT)
            ];
            $insertStmt = $pdo->prepare($insert);
            $insertStmt->execute($params);
            // ok, assuming that succeeded, user is now registered. need their user ID to set up the session
            $_SESSION['UserID'] = $pdo->lastInsertId();
            $_SESSION['Username'] = $username;
            $result = array("status" => 200, "success" => TRUE);
            echo json_encode($result);
        }
    }
    catch (Exception $e) {
        $result = array ("status" => 400, "success" => FALSE, "error" => "Unknown server error");
        echo json_encode($result);
    }
?>