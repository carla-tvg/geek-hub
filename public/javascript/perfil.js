// perfil.js

// Función para mostrar la información del perfil
async function mostrarPerfil() {
    // Obtener el ID del usuario del localStorage
    const userId = localStorage.getItem('userId');

    if (userId) {
        try {
            // Hacer una llamada al backend para obtener la información del usuario
            const response = await fetch(`/api/usuarios/${userId}`);
            if (!response.ok) throw new Error('Error al obtener la información del usuario');

            const usuario = await response.json();

            const perfilInfo = document.getElementById('perfilInfo');
            perfilInfo.innerHTML = `
                
                <p><strong>Nombre:</strong> ${usuario.nombreCompleto || 'No disponible'}</p>
                <p><strong>Email:</strong> ${usuario.correo || 'No disponible'}</p>
                <p><strong>Teléfono:</strong> ${usuario.telefono || 'No disponible'}</p>
            `;
        } catch (error) {
            console.error(error);
            document.getElementById('perfilInfo').innerHTML = '<p>Error al cargar la información del perfil.</p>';
        }
    } else {
        document.getElementById('perfilInfo').innerHTML = '<p>No se encontró información de usuario.</p>';
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', mostrarPerfil);

// Función para cerrar sesión
function cerrarSesion() {
    // Eliminar el ID de usuario del localStorage
    localStorage.removeItem('userId');
    
    // Redirigir al usuario a la página de inicio
    window.location.href = '/'; // Cambia esto a la URL que desees para la página de inicio
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', mostrarPerfil);

// Agregar evento al enlace de cerrar sesión
document.getElementById('cerrarSesion').addEventListener('click', (event) => {
    event.preventDefault(); // Evitar la acción por defecto del enlace
    cerrarSesion();
});