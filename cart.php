<?php

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
        $allItemsInserted = true; // Flag to track if all items were inserted
        foreach ($cartDetails as $item) {
            $productId = mysqli_real_escape_string($conn, $item['id']);
            $quantity = mysqli_real_escape_string($conn, $item['quantity']);
            $price = mysqli_real_escape_string($conn, $item['price']);

            $itemSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ('$orderId', '$productId', '$quantity', '$price')";
            if (!$conn->query($itemSql)) {
                $allItemsInserted = false; // Set flag to false if insert fails
            }
        }

        if ($allItemsInserted) {
            // echo json_encode(['status' => 'success', 'message' => 'Order successfully submitted', 'orderId' => $orderId]);

            //Prepare the whatsapp Api payload
            $curl = curl_init();
            $data = array(
                "api_key" => "TLIAYKlYbyZwMIPnfdUOgyswysOeyOislkXpBPOqAonILiiTaEDuDZEMYKbMQN",
                "to" => "2347089830948",
                "from" => "Termii_arklink",
                "sms" => "A new order has been placed. Kindly check your dashboard for more info ",
                "type" => "plain",
                "channel" => "whatsapp"
            );

            $post_data = json_encode($data);

            curl_setopt_array($curl, array(
                CURLOPT_URL => "https://v3.api.termii.com/api/sms/send",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => $post_data,
                CURLOPT_HTTPHEADER => array(
                    "Content-Type: application/json"
                ),
            ));

            $response = curl_exec($curl);

            curl_close($curl);

            echo json_encode(['status' => 'success', 'message' => $response, 'orderId' => $orderId]);

        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to insert some order items']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to insert order. Error: ' . $conn->error]);
    }

    // Close the database connection
    $conn->close();
}
