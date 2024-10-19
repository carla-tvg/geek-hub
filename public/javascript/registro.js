// Función para validar el formato del correo
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Función para validar el número de teléfono
function validarTelefono(telefono) {
    const regex = /^[0-9]{10}$/;  // Asumiendo que el número debe tener 10 dígitos
    return regex.test(telefono);
}

// Función para mostrar errores en el formulario
function mostrarError(campo, mensaje) {
    document.getElementById(`error${campo}`).innerText = mensaje;
}

// Función para limpiar errores del formulario
function limpiarErrores() {
    document.querySelectorAll(".error").forEach(span => span.innerText = "");
}

function registerUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe
    limpiarErrores(); // Limpia mensajes de error previos

    // Captura los valores de los campos del formulario
    const nombreCompleto = event.target.nombreCompleto.value.trim();
    const telefono = event.target.telefono.value.trim();
    const correo = event.target.correo.value.trim();
    const password = event.target.password.value.trim();
    const confirmPassword = event.target.confirmPassword.value.trim();

    let isValid = true;

    // Validaciones con mensajes de error personalizados
    if (!nombreCompleto) {
        mostrarError("Nombre", "El nombre es obligatorio");
        isValid = false;
    }

    if (!telefono) {
        mostrarError("Telefono", "El teléfono es obligatorio");
        isValid = false;
    } else if (!validarTelefono(telefono)) {
        mostrarError("Telefono", "El número debe tener 10 dígitos");
        isValid = false;
    }

    if (!correo) {
        mostrarError("Correo", "El correo es obligatorio");
        isValid = false;
    } else if (!validarCorreo(correo)) {
        mostrarError("Correo", "Formato de correo inválido");
        isValid = false;
    }

    if (!password) {
        mostrarError("Password", "La contraseña es obligatoria");
        isValid = false;
    } else if (password.length < 6) {
        mostrarError("Password", "La contraseña debe tener al menos 6 caracteres");
        isValid = false;
    }

    if (password !== confirmPassword) {
        mostrarError("ConfirmPassword", "Las contraseñas no coinciden");
        isValid = false;
    }

    // Si no es válido, detiene el registro
    if (!isValid) return;

    // Si todo es válido, se registra al usuario
    const usuario = { nombreCompleto, telefono, correo, password };

    console.log(usuario); //prueba

    // Enviar solicitud para agregar el usuario al servidor
    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        alert("Usuario registrado exitosamente");
        event.target.reset(); // Resetea el formulario
    })
    .catch(error => {
        console.error(error);
        alert('No se pudo registrar el usuario: ' + error.message);
    });
}

function toggleForm() {
    const registroForm = document.querySelector(".sign-up");
    const loginForm = document.querySelector(".sign-in");

    registroForm.classList.toggle("active");
    loginForm.classList.toggle("active");
}
