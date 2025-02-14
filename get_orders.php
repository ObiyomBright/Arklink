<?php
session_start();
include('database.php');
header('Content-Type: application/json');

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

//Function to check if the user is admin
function isAdmin()
{
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Restrict access to non-admin users
function restrictAccess()
{
    if (!isAdmin()) {
        echo json_encode(['message' => 'Error: Unauthorized access. Admin permission required.']);
        exit();
    }
}

isAdmin();
restrictAccess();

// Fetch orders
$sql = "SELECT id, phone_number, address, total_price, status FROM orders ORDER BY id DESC";
$result = $conn->query($sql);

$orders = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $order_id = $row["id"];
        $items = array();

        // Fetch order items for this order
        $items_query = "SELECT product_id, quantity FROM order_items WHERE order_id = $order_id";
        $items_result = $conn->query($items_query);

        if ($items_result->num_rows > 0) {
            while ($item = $items_result->fetch_assoc()) {
                $product_id = $item["product_id"];
                $quantity = $item["quantity"];

                // Fetch product details
                $product_query = "SELECT name, producer FROM products WHERE id = $product_id";
                $product_result = $conn->query($product_query);

                if ($product_result->num_rows > 0) {
                    $product = $product_result->fetch_assoc();
                    $product_name = $product["name"];
                    $company = $product["producer"];

                    // Format product details
                    $items[] = "($product_name - $company: $quantity)";
                }
            }
        }

        // Add order details to the array
        $orders[] = array(
            "order_id" => $order_id,
            "phone_number" => $row["phone_number"],
            "address" => $row["address"],
            "items" => implode(", ", $items),
            "total_price" => $row["total_price"],
            "status" => $row["status"]
        );
    }
}

// Send JSON response
echo json_encode($orders);

$conn->close();
