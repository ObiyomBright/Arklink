<?php
include 'database.php';
header('Content-Type: application/json');

// Read offset and limit from URL
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 15;

// SQL query to fetch product batch
$sql = "SELECT id, name, img, category, price, size, producer FROM products LIMIT $limit OFFSET $offset";
$result = mysqli_query($conn, $sql);

if ($result === false) {
    echo json_encode(['error' => 'Database query failed']);
    mysqli_close($conn);
    exit;
}

$products = [];

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $row['img']);
        finfo_close($finfo);

        if (in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'])) {
            $row['img'] = 'data:' . $mimeType . ';base64,' . base64_encode($row['img']);
        } else {
            $row['img'] = 'data:image/jpeg;base64,' . base64_encode($row['img']);
        }

        $products[] = $row;
    }
}

echo json_encode($products);
mysqli_close($conn);
?>
