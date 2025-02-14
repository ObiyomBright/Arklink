const form = document.getElementById('form');

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
                alert(result.message);
            }
        })
    .catch(error => alert('Unexpected error:', error));
})