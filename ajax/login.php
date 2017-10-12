<?php

    require_once '../init.php';

    $data = getJSONFromPost();

    $username = $data['username'];
    $password = $data['password'];

    $query = "
    SELECT UserID, Username, u.Password
    FROM Users u
    WHERE Username = ?";
    $params = [
        $username
    ];

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $row = $stmt->fetch();
    $didOutput = FALSE;

    if (isset($row)) {
        if (password_verify($password, $row['Password'])) {
            $didOutput = TRUE;
            // success!
            $_SESSION['UserID'] = $row['UserID'];
            $_SESSION['Username'] = $row['Username'];
            
            $result = array ( "status" => 200, "loginSuccess" => TRUE);
            echo json_encode($result);
        }
    }
    if (!$didOutput) {  
        $result = array ("status" => 200, "loginSuccess" => FALSE);
        echo json_encode($result);
    }
?>