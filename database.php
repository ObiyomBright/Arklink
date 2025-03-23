<?php
$server = 'localhost';
$user = 'root';
$password = 'password';
$name = 'arklink';

try {
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $conn = mysqli_connect($server, $user, $password, $name);

} catch (mysqli_sql_exception $e) {
    die("Error connecting to database: " . $e->getMessage());
}
?>
