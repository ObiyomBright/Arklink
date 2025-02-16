<?php
session_start();
include('database.php');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $requestbody = file_get_contents('php://input'); //Recieves json from request
    $data = json_decode($requestbody, true); //Decodes json to php array
    if (json_last_error() === JSON_ERROR_NONE) {
        // Sanitize form data
        $firstname = filter_var($data['firstname'], FILTER_SANITIZE_SPECIAL_CHARS);
        $lastname = filter_var($data['lastname'], FILTER_SANITIZE_SPECIAL_CHARS);
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $phonenumber = filter_var($data['phonenumber'], FILTER_SANITIZE_SPECIAL_CHARS);
        $password = filter_var($data['password'], FILTER_SANITIZE_SPECIAL_CHARS);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Unable to complete your request. Please try again']);
    }
}

// Query to check if email already exists in the users table
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $sql);

// Email exists - send an error message
if (mysqli_num_rows($result) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
} else {
    //Email does not exist - Append the data to the database
    $sql = "INSERT INTO users (firstname, lastname, email, password, phonenumber) 
    VALUES ('$firstname', '$lastname', '$email', '$password_hash', '$phonenumber')";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        //Set session variables
        $_SESSION['username'] = $email;
        $_SESSION['role'] = 'customer';

        echo json_encode(['status' => 'successful', 'message' => 'Registeration successful']);
    }
}

mysqli_close($conn);

?>