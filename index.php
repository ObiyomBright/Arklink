<?php
include 'database.php';

$sql = "SELECT id, img, price, size, producer FROM products";
$result = mysqli_query($conn, $sql);
$items = [];

if(mysqli_num_rows($result)> 0){
    while($row = mysqli_fetch_assoc($result)){
        $items[] =  $row; 
    }
}
//Close connection
mysqli_close($conn);
//Return as JSON
header('Content-Type: application/json');
echo json_encode($items);

?>