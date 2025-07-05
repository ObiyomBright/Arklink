document.addEventListener("DOMContentLoaded", function () {
    fetchOrders();
});

// Function to fetch and display orders
function fetchOrders() {
    fetch("get_orders.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const tableBody = document.getElementById("ordersTable");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach(order => {
                const row = document.createElement("tr");

                // Create table columns
                row.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.phone_number}</td>
                    <td>${order.address}</td>
                    <td>${order.items}</td>
                    <td>&#8358;${Number(order.total_price).toLocaleString('en-US')}</td>
                    <td>${order.status}</td>
                    <td>
                        <select class="status-select" data-order-id="${order.order_id}">
                            <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                            <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
                            <option value="Shipped" ${order.status === "Shipped" ? "selected" : ""}>Shipped</option>
                            <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        </select>
                    </td>
                `;

                tableBody.appendChild(row);
            });

            // Attach event listeners for status updates
            document.querySelectorAll(".status-select").forEach(select => {
                select.addEventListener("change", updateStatus);
            });
        })
        .catch(error => console.error("Error fetching orders:", error));
}

function alertBox(message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "alertBox";
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Function to update order status
function updateStatus(event) {
    const selectElement = event.target;
    const orderId = selectElement.getAttribute("data-order-id");
    const newStatus = selectElement.value;

    fetch("update_status.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `order_id=${orderId}&status=${newStatus}`
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log response from server
        })
        .catch(error => console.error("Error updating status:", error));
}
