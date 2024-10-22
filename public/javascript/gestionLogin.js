async function loginUser(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const email = document.querySelector('input[name="correoLogin"]').value;
    const password = document.querySelector('input[name="passwordLogin"]').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correoLogin: email, passwordLogin: password }),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en el inicio de sesión');
        }

        const data = await response.json();
        // Manejar la respuesta del servidor
        if (data.success) {
            // Almacenar el ID del usuario en localStorage
            localStorage.setItem('userId', data.user.id); // Aquí asumo que has modificado tu controlador para incluir el ID

            // Redirigir a perfil.html
            window.location.href = '/perfil.html'; // Redirecciona a la página de perfil
        } else {
            // Mostrar mensaje de error
            const errorMessages = document.getElementById('loginErrorMessages');
            errorMessages.innerHTML = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        const errorMessages = document.getElementById('loginErrorMessages');
        errorMessages.innerHTML = error.message || 'Hubo un problema al iniciar sesión';
    }
}

// Asignar el evento al formulario
document.getElementById('loginForm').addEventListener('submit', loginUser);
