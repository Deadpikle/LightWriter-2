<?php

    require_once '../init.php';

    $data = getJSONFromPost();

    $blocks = $data["blocks"];
    $name = $data["name"];
    $rules = $data["rules"];
?>