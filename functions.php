<?php

    function getJSONFromPost() {
        return json_decode(file_get_contents('php://input'), true);
    }
?>