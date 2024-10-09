// login.js

//validaciones para el formulario de inicio de sesión

// Función para validar el formato del correo
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Función para iniciar sesión con validaciones
function loginUser(event) {
    event.preventDefault();

    const correoLogin = event.target.correoLogin.value.trim();
    const passwordLogin = event.target.passwordLogin.value.trim();

    // Validaciones
    if (!correoLogin || !passwordLogin) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (!validarCorreo(correoLogin)) {
        alert("Formato de correo inválido");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(u => u.correo === correoLogin && u.password === passwordLogin);

    if (usuario) {
        alert("Inicio de sesión exitoso");
        // Aquí puedes redirigir a la página de inicio o hacer algo más
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}


