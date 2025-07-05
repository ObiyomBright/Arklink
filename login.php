<?php
session_start();
include('database.php');

if($_SERVER['REQUEST_METHOD']== 'POST'){
    $requestbody = file_get_contents('php://input'); //Recieves json from request
    $data = json_decode($requestbody, true); //Decodes json to php array

        if(json_last_error() === JSON_ERROR_NONE){
        // Sanitize form data
        $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
        $password = filter_var($data['password'], FILTER_SANITIZE_SPECIAL_CHARS);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Unable to complete request. Please try again']);
        exit;
    }
} 

//Query to get email and password and role
$sql = "SELECT password, role FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result) > 0){
    $row = mysqli_fetch_assoc($result);
    $hashed_password = $row['password'];
    $role = $row['role'];

    //Verify the password
    if(password_verify($password, $hashed_password)){

        //Check if user is an admin
        if($role === 'admin'){
            $_SESSION['username'] = $email;
            $_SESSION['role'] = 'admin';
            echo json_encode(['status' => 'success', 'message' => 'Login successful']);
        } else {   // User is not an admin
            $_SESSION['role'] = 'customer';
            echo json_encode(['status' => 'error', 'message' => 'Access denied: Admin only']);
            exit;
        }
    } else {
        //Password does not match
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
        exit;
    }
}else {
    echo json_encode(['status' => 'error', 'message' => 'Email was not found']);
}

mysqli_close($conn);
?>