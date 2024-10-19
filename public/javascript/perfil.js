document.addEventListener('DOMContentLoaded', function() {
    // Obtener el correo del usuario almacenado en localStorage
    const correoUsuario = localStorage.getItem('correoUsuario');

    // Verificar si el correo del usuario está presente
    if (!correoUsuario) {
        document.getElementById('perfilInfo').innerHTML = '<p>No se ha encontrado información del usuario. Por favor, inicie sesión.</p>';
        return; // Detener la ejecución si no hay correo
    }

    // Función para cargar los datos del usuario
    function cargarDatosUsuario() {
        fetch(`/api/usuarios/${correoUsuario}`) // Hacer la solicitud a la nueva ruta
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los datos del usuario');
                }
                return response.json();
            })
            .then(data => {
                const perfilDiv = document.getElementById('perfilInfo');
                perfilDiv.innerHTML = `
                    <p><strong>Nombre:</strong> ${data.nombreCompleto}</p>
                    <p><strong>Email:</strong> ${data.correo}</p>
                    <p><strong>Teléfono:</strong> ${data.telefono || 'N/A'}</p>
                `;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('perfilInfo').innerHTML = '<p>Error al cargar la información del usuario.</p>';
            });
    }

    cargarDatosUsuario(); // Llamar a la función para cargar los datos al cargar la página
});
