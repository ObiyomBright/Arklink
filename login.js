const form = document.getElementById('form');

function alertBox(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alertBox';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 5000);
}

form.addEventListener('submit', async (e) => {

    e.preventDefault();
    const formData = new FormData(form);
    const formJSON = Object.fromEntries(formData.entries());

    await fetch('login.php', {
        method: 'POST',
        body: JSON.stringify(formJSON)
    })
        .then(response => response.json())
        .then(result => {
            if (result.status == 'success') {
                window.location.href = 'get_orders.html';
            } else {
                alertBox(result.message);
            }
        })
    .catch(error => {
        alertBox('Unexpected error:', error);
        console.error(error);
}
)})