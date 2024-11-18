const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password == confirmPassword) {
        const formData = new FormData(form);

        const formJSON =  Object.fromEntries(formData.entries());

            await fetch('sign_up.php', {
                method: 'POST',
                body: JSON.stringify(formJSON)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                
                if(result.status =='successful'){
                    window.location.href = 'index.html';
                };
            })
            .catch(error => alert('Unexpected error:', error));

    } else {
        alert('Passwords do not match');
    }
});