<?php

include 'database.php';
header('Content-Type: application/json');

//SQL query to fetch product data
$sql = "SELECT id, img, price, size, producer FROM products WHERE category = 'marble'";
$result = mysqli_query($conn, $sql);

    // Return error if the query fails
if ($result === false) {
    echo json_encode(['error' => 'Database query failed']);
    mysqli_close($conn);
    exit;
}

$products = array();

//Fetch products and store them in products array
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Detect MIME type of the image stored in BLOB
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $row['img']);
        finfo_close($finfo);

    // Ensure only supported types are processed
    if (in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'])) {
        $row['img'] = 'data:' . $mimeType . ';base64,' . base64_encode($row['img']);
    } else {
        // Default to a placeholder or empty if type is unsupported
        $row['img'] = 'data:image/jpeg;base64,' . base64_encode($row['img']);
    }
     
        $products[] =  $row;
    }
}

//Return as JSON
echo json_encode($products);

//Close connection
mysqli_close($conn);
