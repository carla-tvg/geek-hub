function loginUser(event) {
    event.preventDefault();
    const correoAdminLogin = document.getElementById('correoAdminLogin').value;
    const passwordAdminLogin = document.getElementById('passwordAdminLogin').value;

    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: correoAdminLogin, password: passwordAdminLogin }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirigir según el rol del usuario
            if (data.role === 'superadmin') {
                window.location.href = '/admin/panelAdmin.html'; // Redirigir a superadmin
            } else if (data.role === 'admin') {
                window.location.href = '/admin/panelEcommerce.html'; // Redirigir a admin
            } else {
                alert('Rol no reconocido');
            }
        } else {
            alert('Correo o contraseña incorrectos');
        }
    })
    .catch(error => console.error('Error:', error));
}