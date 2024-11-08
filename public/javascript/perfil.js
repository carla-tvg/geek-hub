// Función para obtener el token de autenticación
function obtenerToken() {
    return localStorage.getItem('authToken');
}

// Función para redirigir al usuario si no está autenticado
function redirigirALogin() {
    window.location.href = '/registro.html';
}

// Función para mostrar la información del perfil
async function mostrarPerfil() {
    
    const token = obtenerToken();
    console.log(token); 

    if (token) {
        try {
            const response = await fetch('http://localhost:8080/usuarios/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Token enviado en el encabezado
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',  // Cambiar a 'same-origin' si no se usan cookies para autenticación
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener el perfil`);
            }

            const data = await response.json();
            const perfilInfo = document.getElementById('perfilInfo');
            perfilInfo.innerHTML = `
                <h3>Información del Perfil</h3>
                <p><strong>Nombre:</strong> ${data.nombre} ${data.apellido}</p>
                <p><strong>Correo:</strong> ${data.correo}</p>
                <p><strong>Teléfono:</strong> ${data.telefono}</p>
            `;
        } catch (error) {
            console.error('Error al obtener la información del perfil:', error);
            document.getElementById('perfilInfo').innerHTML = '<p>Error al cargar la información del perfil.</p>';
        }
    } else {
        redirigirALogin();
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('authToken');
    redirigirALogin();
}

// Llamar a la función de mostrar perfil al cargar la página
document.addEventListener('DOMContentLoaded', mostrarPerfil);

// Agregar evento al enlace de cerrar sesión
document.getElementById('cerrarSesion').addEventListener('click', (event) => {
    event.preventDefault();
    cerrarSesion();
});
