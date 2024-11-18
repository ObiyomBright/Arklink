<?php
include('database.php');

if($_SERVER['REQUEST_METHOD']== 'POST'){
    $image = $_FILES['productImage']['tmp_name'];
    $imageSize = $_FILES['productImage']['size'];
    $imageType = $_FILES['productImage']['type'];
    $productId = $_POST['productId'];
    $company = $_POST['company'];
    $category = $_POST['category'];
    $size = $_POST['size'];
    $price = $_POST['price'];
}

//Define allowed file types
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$maxSize = 800 * 1024; //800kb

//Validate File Size
if($imageSize > $maxSize){
    die('Error: File size exceeds the maximum limit of 800KB');
}
//Validate File type
if(!in_array($imageType, $allowedTypes)){
    die('Error: Only JPEG, PNG and WebP files are allowed');
}

//Convert the image to binary data
$imageData = file_get_contents($image);

//Check if the product is already in the database
$sql = "SELECT name FROM products where name = '$productId'";
$result = mysqli_query($conn, $sql);


if(mysqli_num_rows($result) > 0){
    die('Error: Product already exists in the database');
}

//Add product to the database
$sql = "INSERT INTO products (name, img, category, price, size, producer) 
VALUES ('$productId', '$image', '$category', '$price', '$size', '$company')";

$result = mysqli_query($conn, $sql);
if($result){
    echo 'Product added successfully';
} else {
    echo 'Error: Unable to upload file. Try again';
}

//Close connection
mysqli_close($conn);
?>