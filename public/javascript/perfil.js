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
    console.log("Token:", token); 

    if (token) {
        try {
            const response = await fetch('http://localhost:8080/usuarios/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
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
            perfilInfo.style.display = 'block'; // Mostrar la información del perfil
            document.getElementById("editarInfo").style.display = 'none'; // Ocultar el formulario de edición
        } catch (error) {
            console.error('Error al obtener la información del perfil:', error);
            document.getElementById('perfilInfo').innerHTML = '<p>Error al cargar la información del perfil.</p>';
        }
    } else {
        redirigirALogin();
    }
}

// Función para cargar los datos actuales del usuario en el formulario de edición
function cargarDatosUsuario() {
    fetch('/api/usuario', {
        headers: {
            'Authorization': `Bearer ${obtenerToken()}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("nombre").value = data.nombre;
        document.getElementById("email").value = data.email;
        document.getElementById("direccion").value = data.direccion || '';
        document.getElementById("telefono").value = data.telefono || '';
    })
    .catch(error => console.error("Error al cargar los datos del usuario:", error));
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('authToken');
    localStorage.removeItem("user");
    redirigirALogin();
}

// Agregar eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarPerfil();

    // Evento para ver el perfil
    document.getElementById('verPerfil').addEventListener('click', (event) => {
        event.preventDefault();
        mostrarPerfil(); // Mostrar solo la información del perfil
    });

    // Evento para editar información del perfil
    document.getElementById("editarInfoLink").addEventListener("click", (event) => {
        event.preventDefault();
        document.getElementById("perfilInfo").style.display = "none"; // Ocultar la información del perfil
        document.getElementById("editarInfo").style.display = "block"; // Mostrar el formulario de edición
        cargarDatosUsuario(); // Rellenar el formulario con los datos actuales del usuario
    });

    // Evento para cerrar sesión
    document.getElementById("cerrarSesion").addEventListener("click", cerrarSesion);
});

// Función para enviar los datos actualizados
document.getElementById("formEditarInfo").addEventListener("submit", async (event) => {
    event.preventDefault();

    const datosActualizados = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("email").value
    };

    try {
        const response = await fetch(`/usuarios/editar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${obtenerToken()}`
            },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            alert("Información actualizada con éxito.");
            mostrarPerfil(); // Volver a mostrar el perfil actualizado
            document.getElementById("perfilInfo").style.display = "block";
            document.getElementById("editarInfo").style.display = "none";
        } else {
            alert("Error al actualizar la información del usuario.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al enviar los datos.");
    }
});
