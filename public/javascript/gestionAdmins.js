function loginUser(event) {
    event.preventDefault();
    const correoAdminLogin = document.getElementById('correoAdminLogin').value;
    const passwordAdminLogin = document.getElementById('passwordAdminLogin').value;

    fetch('http://localhost:8080/usuarios/login', {  // Asegúrate de cambiar a la URL de tu backend en producción
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: correoAdminLogin, password: passwordAdminLogin }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        return response.text(); // Recibimos el token como texto plano
    })
    .then(token => {
        localStorage.setItem('token', token); // Guardar el token en localStorage

        // Obtener el rol del token decodificado o hacer una solicitud para obtenerlo
        if (token) {
            // Dependiendo del rol (puedes cambiar esta lógica según lo necesites)
            window.location.href = '/admin/panelAdmin.html';  // Panel para superadmin o admin
        }
    })
    .catch(error => alert('Error en el inicio de sesión: ' + error.message));
}
