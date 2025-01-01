<?php
include('database.php');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $productId = $_POST['productId'];
    $company = $_POST['company'];
    $category = $_POST['category'];
    $size = $_POST['size'];
    $price = $_POST['price'];
    $image = $_FILES['productImage']['tmp_name'];
    $imageSize = $_FILES['productImage']['size'];
    $imageType = $_FILES['productImage']['type'];

    // Allowed file types and max size
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize = 800 * 1024; // 800 KB

    // Validate file type
    if (!in_array($imageType, $allowedTypes)) {
        echo json_encode(['message' => 'Error: Only JPEG, PNG, and WebP files are allowed.']);
        exit();
    }

    // Validate file size
    if ($imageSize > $maxSize) {
        echo json_encode(['message' => 'Error: File size exceeds the maximum limit of 800KB.']);
        exit();
    }

    // Convert image to binary
    $imageData = file_get_contents($image);

    // Check if product already exists
    $sql = "SELECT * FROM products WHERE name = ? AND producer = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $productId, $company);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['message' => 'Error: Product already exists in the database.']);
        exit();
    }

    // Insert product into the database
    $sql = "INSERT INTO products (name, img, category, price, size, producer) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssss', $productId, $imageData, $category, $price, $size, $company);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Product added successfully.']);
    } else {
        echo json_encode(['message' => 'Error: Unable to add product.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['message' => 'Invalid request method.']);
}
?>
