<?php
    $basePath = str_replace($_SERVER['DOCUMENT_ROOT'], '', dirname(__FILE__));

    //require_once('constants.php');
    require_once('database.php');
    require_once('functions.php');

    session_start();

    $whitelist = array(
        '127.0.0.1',
        '::1'
    );
    $isLocalHost = FALSE;
    if (in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
        $isLocalHost = TRUE;
    }
?>