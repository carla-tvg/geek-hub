// Función para validar el formulario de registro
function registerUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos del formulario
    const form = event.target;
    const nombreCompleto = form.nombreCompleto.value.trim();
    const telefono = form.telefono.value.trim();
    const correo = form.correo.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    // Limpiar mensajes de error
    const errorMessages = document.getElementById('errorMessages');
    errorMessages.innerHTML = '';

    // Validaciones
    let errores = [];
    
    // Validación de campo vacío
    if (!nombreCompleto || !telefono || !correo || !password || !confirmPassword) {
        errores.push('Todos los campos son obligatorios.');
    }

    // Validación de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
        errores.push('Por favor, introduce un correo electrónico válido.');
    }

    // Validación de número de teléfono
    const phonePattern = /^[0-9]{10,}$/; // Ejemplo: solo números y al menos 10 dígitos
    if (!phonePattern.test(telefono)) {
        errores.push('El número de teléfono debe contener al menos 10 dígitos.');
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
        errores.push('Las contraseñas no coinciden.');
    }

    // Mostrar errores si los hay
    if (errores.length > 0) {
        errores.forEach(error => {
            const p = document.createElement('p');
            p.textContent = error;
            errorMessages.appendChild(p);
        });
        return; // Detener la ejecución si hay errores
    }

    // Crear objeto JSON
    const usuario = {
        nombreCompleto: nombreCompleto,
        telefono: telefono,
        correo: correo,
        password: password // Considerar cifrar la contraseña
    };

    // Almacenar el usuario en localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Mostrar mensaje de éxito y objeto JSON
    alert(`¡Registro exitoso para ${nombreCompleto}!`);
    console.log('Usuario registrado:', JSON.stringify(usuario, null, 2));

    // Simulación de usuarios.json
    console.log('usuarios.json', JSON.stringify(usuarios, null, 2));

    // Limpiar el formulario
    form.reset();
}

// Función para validar el formulario de inicio de sesión
function loginUser(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores de los campos del formulario
    const form = event.target;
    const correoLogin = form.correoLogin.value.trim();
    const passwordLogin = form.passwordLogin.value;

    // Limpiar mensajes de error
    const loginErrorMessages = document.getElementById('loginErrorMessages');
    loginErrorMessages.innerHTML = '';

    // Validaciones
    let errores = [];
    
    // Validación de campo vacío
    if (!correoLogin || !passwordLogin) {
        errores.push('Todos los campos son obligatorios.');
    }

    // Validación de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correoLogin)) {
        errores.push('Por favor, introduce un correo electrónico válido.');
    }

    // Mostrar errores si los hay
    if (errores.length > 0) {
        errores.forEach(error => {
            const p = document.createElement('p');
            p.textContent = error;
            loginErrorMessages.appendChild(p);
        });
        return; // Detener la ejecución si hay errores
    }

    // Aquí puedes manejar el inicio de sesión (ej. verificar credenciales)
    alert(`¡Inicio de sesión exitoso para ${correoLogin}!`);
}

// Función para alternar entre formularios
function toggleForm() {
    const signUpForm = document.querySelector('.sign-up');
    const signInForm = document.querySelector('.sign-in');

    signUpForm.classList.toggle('active');
    signInForm.classList.toggle('active');
}
