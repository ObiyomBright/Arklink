<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0); // Exit to handle preflight only
}

// Include database connection
include 'database.php';

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize input
    $totalPrice = mysqli_real_escape_string($conn, $_POST['totalPrice']);
    $phoneNumber = mysqli_real_escape_string($conn, $_POST['phoneNumber']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $cartDetails = json_decode($_POST['cartDetails'], true);

    // Insert order into orders table
    $sql = "INSERT INTO orders (total_price, phone_number, address) VALUES ('$totalPrice', '$phoneNumber', '$address')";
    if ($conn->query($sql) === TRUE) {
        $orderId = $conn->insert_id; // Get the last inserted order ID

        // Insert each cart item into order_items table
        foreach ($cartDetails as $item) {
            $productId = mysqli_real_escape_string($conn, $item['id']);
            $quantity = mysqli_real_escape_string($conn, $item['quantity']);
            $price = mysqli_real_escape_string($conn, $item['price']);

            $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ('$orderId', '$productId', '$quantity', '$price')";
            $conn->query($sql);
        }
        echo json_encode(['status' => 'success', 'message' => 'Order successfully submitted']);
    } else {
        echo json_encode(['status' => 'error', 'message' => $sql . "<br>" . $conn -> error]);
        // echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the database connection
    $conn->close();
}
