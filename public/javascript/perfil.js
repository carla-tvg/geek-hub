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
                credentials: 'same-origin',
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

// Agregar evento al enlace de Ver Perfil
document.getElementById('verPerfil').addEventListener('click', (event) => {
    event.preventDefault();
    mostrarPerfil(); // Llama a la función mostrarPerfil al hacer clic en "Ver Perfil"
});

document.getElementById("editarInfoLink").addEventListener("click", (event) => {
    event.preventDefault();

    // Ocultar contenido de perfil y mostrar el formulario de edición
    document.getElementById("perfilInfo").style.display = "none";
    document.getElementById("editarInfo").style.display = "block";

    // Rellenar el formulario con los datos actuales del usuario (simulado aquí)
    cargarDatosUsuario();
});

function cargarDatosUsuario() {
    // Aquí llamas a la API para obtener la información del usuario
    fetch('/api/usuario')
        .then(response => response.json())
        .then(data => {
            document.getElementById("nombre").value = data.nombre;
            document.getElementById("email").value = data.email;
            document.getElementById("direccion").value = data.direccion || '';
            document.getElementById("telefono").value = data.telefono || '';
        })
        .catch(error => console.error("Error al cargar los datos del usuario:", error));
}

document.getElementById("formEditarInfo").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener el ID del usuario que deseas editar
    const userId = 1; // O el ID real del usuario obtenido de algún lugar, como un token o perfil

    // Recoger los datos del formulario
    const datosActualizados = {
        nuevoNombre: document.getElementById("nombre").value,
        nuevoApellido: document.getElementById("apellido").value,
        nuevoTelefono: document.getElementById("telefono").value,
        nuevoCorreo: document.getElementById("email").value,
        nuevoPassword: document.getElementById("password").value  // Este campo puede estar oculto o ser opcional
    };

    // Construir la URL de la solicitud
    let queryParams = Object.keys(datosActualizados)
        .filter(key => datosActualizados[key] !== "")
        .map(key => `${key}=${encodeURIComponent(datosActualizados[key])}`)
        .join("&");

    try {
        const response = await fetch(`/usuarios/editar/${userId}?${queryParams}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer <TOKEN>" // Añade el token del usuario si es necesario
            }
        });

        if (response.ok) {
            const updatedUser = await response.json();
            alert("Información actualizada con éxito.");
            // Aquí puedes actualizar la vista del perfil con los nuevos datos
        } else {
            alert("Error al actualizar la información del usuario.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al enviar los datos.");
    }
});