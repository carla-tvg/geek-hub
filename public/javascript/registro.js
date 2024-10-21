// Función para validar el correo
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function validarTelefono(telefono) {
    const regex = /^3[0-9]{9}$/; // Debe empezar con 3 y tener 10 dígitos
    const isNumeric = /^\d+$/.test(telefono); // Verifica si es numérico
    return regex.test(telefono) && isNumeric; // Retorna verdadero solo si ambas condiciones se cumplen
}

// Función para mostrar errores en el formulario
function mostrarError(campo, mensaje) {
    document.getElementById(`error${campo}`).innerText = mensaje;
}

// Función para limpiar errores del formulario
function limpiarErrores() {
    document.querySelectorAll(".error").forEach(span => span.innerText = "");
}

// Validar número de teléfono en tiempo real
document.getElementById('telefono').addEventListener('input', function() {
    // Permitir solo dígitos
    this.value = this.value.replace(/[^3\d]/g, '');

    // Limpia mensajes de error
    limpiarErrores(); 

    // Verifica el número de teléfono
    const telefono = this.value.trim();
    if (telefono) {
        if (!validarTelefono(telefono)) {
            mostrarError("Telefono", "El número debe comenzar con 3 y tener 10 dígitos");
        }
    } else {
        mostrarError("Telefono", "El teléfono es obligatorio");
    }
});

/// Validar contraseñas en tiempo real
function validarPassword() {
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMessage = document.getElementById('errorConfirmPassword');
    
    errorMessage.innerText = ""; // Limpia el mensaje de error

    // Solo muestra el mensaje si confirmPassword tiene un valor
    if (confirmPassword) {
        if (password === confirmPassword) {
            // Solo limpiamos el mensaje si las contraseñas coinciden
            errorMessage.style.color = ""; // Resetea el color
        } else {
            errorMessage.innerText = "Las contraseñas no coinciden";
            errorMessage.style.color = "red"; // Cambia el color a rojo si no coinciden
        }
    }
}

// Evento para validar contraseñas en tiempo real
document.getElementById('password').addEventListener('input', validarPassword);
document.getElementById('confirmPassword').addEventListener('input', validarPassword);

function registerUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe
    limpiarErrores(); // Limpia mensajes de error previos

    // Captura los valores de los campos del formulario
    const nombreCompleto = event.target.nombreCompleto.value.trim();
    const telefono = event.target.telefono.value.trim();
    const correo = event.target.correo.value.trim();
    const password = event.target.password.value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim(); // Cambiar aquí

    let isValid = true;

    // Validaciones con mensajes de error personalizados
    if (!nombreCompleto) {
        showNotification("El nombre es obligatorio", "error");
        isValid = false;
    }

    if (!telefono) {
        showNotification("El teléfono es obligatorio", "error");
        isValid = false;
    } else if (!validarTelefono(telefono)) {
        showNotification("El número debe comenzar con 3 y tener 10 dígitos", "error");
        isValid = false;
    }

    if (!correo) {
        showNotification("El correo es obligatorio", "error");
        isValid = false;
    } else if (!validarCorreo(correo)) {
        showNotification("Formato de correo inválido", "error");
        isValid = false;
    }

    if (!password) {
        showNotification("La contraseña es obligatoria", "error");
        isValid = false;
    } else if (password.length < 6) {
        showNotification("La contraseña debe tener al menos 6 caracteres", "error");
        isValid = false;
    }

    if (password !== confirmPassword) {
        showNotification("Las contraseñas no coinciden", "error");
        isValid = false;
    }

    // Si no es válido, detiene el registro
    if (!isValid) return;

    // Si todo es válido, se registra al usuario
    const usuario = { nombreCompleto, telefono, correo, password };

    console.log(usuario); //prueba

    // Enviar solicitud para agregar el usuario al servidor
    fetch('http://localhost:3000/api/usuarios', {
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
        showNotification("Usuario registrado exitosamente", "success");
        event.target.reset(); // Resetea el formulario
    })
    .catch(error => {
        console.error(error);
        showNotification('No se pudo registrar el usuario: ' + error.message, "error");
    });
}

function toggleForm() {
    const registroForm = document.querySelector(".sign-up");
    const loginForm = document.querySelector(".sign-in");

    registroForm.classList.toggle("active");
    loginForm.classList.toggle("active");
}
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = event.currentTarget.querySelector('i'); // Encuentra el ícono dentro del span

    // Cambiar el tipo de input entre 'password' y 'text'
    if (passwordField.type === 'password') {
        passwordField.type = 'text'; // Mostrar la contraseña
        toggleIcon.classList.remove('fa-eye'); // Cambiar el ícono a "visible"
        toggleIcon.classList.add('fa-eye-slash'); // Cambiar al ícono de "ocultar"
    } else {
        passwordField.type = 'password'; // Ocultar la contraseña
        toggleIcon.classList.remove('fa-eye-slash'); // Cambiar al ícono a "ocultar"
        toggleIcon.classList.add('fa-eye'); // Cambiar al ícono de "visible"
    }
}

function showNotification(message, type) {
    if (type === "success") {
        toastr.success(message);
    } else {
        toastr.error(message);
    }
}