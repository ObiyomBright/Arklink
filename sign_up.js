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
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password == confirmPassword) {
        const formData = new FormData(form);

        const formJSON =  Object.fromEntries(formData.entries());

        try {
            const response = await fetch('sign_up.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formJSON)
            });
            const result = await response.json();
            alertBox(result.message);
                
            if (result.status === 'successful') {
                window.location.href = 'get_orders.html';
            }
        } catch (error) {
            alertBox(`Unexpected error: Try again`);
            console.error(error);
        }

    } else {
        alertBox('Passwords do not match');
    }
});
