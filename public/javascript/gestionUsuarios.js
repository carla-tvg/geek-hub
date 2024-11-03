// Función para cargar usuarios y mostrarlos en la tabla
function cargarUsuarios() {
    const usuariosTableBody = document.getElementById("usuariosTable");

    fetch('/api/usuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los usuarios');
            }
            return response.json();
        })
        .then(usuarios => {
            // Limpiar la tabla antes de agregar nuevos usuarios
            usuariosTableBody.innerHTML = "";

            // Verificar si hay usuarios
            if (usuarios.length === 0) {
                usuariosTableBody.innerHTML = '<tr><td colspan="4">No hay usuarios registrados.</td></tr>';
                return;
            }

            // Agregar cada usuario a la tabla
            usuarios.forEach(usuario => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.correo}</td>
                    <td><button onclick="eliminarUsuario('${usuario.id}')">Eliminar</button></td>
                `;
                usuariosTableBody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error(error);
            usuariosTableBody.innerHTML = '<tr><td colspan="4">No se pudieron cargar los usuarios.</td></tr>';
        });
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`/api/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            cargarUsuarios(); // Recargar la lista de usuarios
        })
        .catch(error => {
            console.error(error);
            alert('No se pudo eliminar el usuario.');
        });
    }
}

const cerrarSesionBtn = document.getElementById("cerrarSesion");
cerrarSesionBtn.addEventListener("click", function () {
    // Aquí puedes manejar la lógica de cierre de sesión
    alert("Cerrando sesión...");
    
    // Redirigir a la página de inicio de sesión
    window.location.href = "/admin/login"; // Asegúrate de que la ruta sea correcta
});

// Cargar usuarios cuando la página se cargue
window.onload = cargarUsuarios;
