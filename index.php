<?php
include 'database.php';
header('Content-Type: application/json');

$sql = "SELECT id, img, price, size, producer FROM products";
$result = mysqli_query($conn, $sql);
$products = array();

//Fetch products and store them in products array
if(mysqli_num_rows($result)> 0){
    while($row = mysqli_fetch_assoc($result)){
        $products[] =  $row; 
    }
}

//Return as JSON
echo json_encode($products);

//Close connection
mysqli_close($conn);
?>   
