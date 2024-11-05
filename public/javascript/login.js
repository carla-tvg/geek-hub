document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Realizar la solicitud al backend para iniciar sesión
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correoLogin: email, passwordLogin: password  }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en el inicio de sesión');
        }
        return response.json();
    })
    .then(data => {
        // Redirigir a la página de perfil
        window.location.href = '/perfil.html'; // Asegúrate de que esta ruta esté configurada*/
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
    });
});
