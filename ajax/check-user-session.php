<?php
    require_once '../init.php';

    if (isset($_SESSION['UserID'])) {
        echo 'Active';
    }
    else {
        echo 'Inactive';
    }
?>