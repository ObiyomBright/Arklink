<?php
// Database connection
include "database.php";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if POST data is set
if (isset($_POST["order_id"]) && isset($_POST["status"])) {
    $order_id = intval($_POST["order_id"]);
    $new_status = $conn->real_escape_string($_POST["status"]);

    // Update status query
    $update_query = "UPDATE orders SET status = '$new_status' WHERE id = $order_id";

    if ($conn->query($update_query) === TRUE) {
        echo "Order status updated successfully";
    } else {
        echo "Error updating order: " . $conn->error;
    }
} else {
    echo "Invalid request";
}

$conn->close();
?>
