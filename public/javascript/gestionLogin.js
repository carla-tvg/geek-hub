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

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión');
        }

        const data = await response.json();
        // Manejar la respuesta del servidor
        if (data.success) {
            // Redirigir a perfil.html
            window.location.href = 'html/perfil.html'; // Redirecciona a la página de perfil
        } else {
            // Mostrar mensaje de errosr
            const errorMessages = document.getElementById('loginErrorMessages');
            errorMessages.innerHTML = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        const errorMessages = document.getElementById('loginErrorMessages');
        errorMessages.innerHTML = 'Hubo un problema al iniciar sesión';
    }
}