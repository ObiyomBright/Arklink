<?php

$server = 'localhost';
$user = 'root';
$password = 'password';
$name = 'arklink';

try {
    $conn = mysqli_connect($server, $user, $password, $name);
   
} catch (mysqli_sql_exception) {
    echo 'error';
}


?>