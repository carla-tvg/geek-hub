document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtén los valores de los campos de entrada
    const email = document.getElementById('correoLogin').value.trim();
    const password = document.getElementById('passwordLogin').value.trim();

    // Validación simple de campos vacíos
    if (!email || !password) {
        document.getElementById('loginErrorMessages').textContent = 'Por favor, ingrese su correo y contraseña.';
        return;
    }

    // Realizar la solicitud al backend para iniciar sesión
    fetch('http://localhost:8080/usuarios/login', { // Ruta para login: usuarios/login
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: email, password: password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales incorrectas o error en el servidor');
        }
        return response.text(); // Cambiado a .text() porque el servidor podría devolver el token como texto
    })
    .then(data => {
        const token = data; // Aquí 'data' es el token como texto plano
        
        if (token) {
            localStorage.setItem('authToken', token); // Guarda el token en localStorage
            window.location.href = '/perfil.html'; // Redirige a la página de perfil
        } else {
            throw new Error('Token no recibido en la respuesta');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loginErrorMessages').textContent = 'Credenciales incorrectas. Inténtalo de nuevo.';
    });
});
