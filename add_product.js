document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = document.getElementById('form');
    const formData = new FormData(form);

    try {
        const response = await fetch('add_product.php', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        const result = await response.json();
        alertBox(result.message);
    } catch (error) {
        console.error('Error:', error);
        alertBox('An error occurred. Please try again.');
    }
});

function alertBox(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alertBox';
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}
