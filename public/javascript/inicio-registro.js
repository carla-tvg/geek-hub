// Obtener los botones de alternancia de formulario
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const signInBtnLink = document.querySelector('.signInBtn-link');

// Obtener los formularios
const signUpForm = document.querySelector('.sign-up');
const signInForm = document.querySelector('.sign-in');

// Función para mostrar el formulario de registro
function showSignUpForm() {
    signUpForm.classList.add('active');  // Agregar clase 'active' para mostrar el registro
    signInForm.classList.remove('active');  // Quitar clase 'active' para ocultar el inicio de sesión
}

// Función para mostrar el formulario de inicio de sesión
function showSignInForm() {
    signInForm.classList.add('active');  // Agregar clase 'active' para mostrar el inicio de sesión
    signUpForm.classList.remove('active');  // Quitar clase 'active' para ocultar el registro
}

// Asignar eventos a los enlaces de alternancia
signUpBtnLink.addEventListener('click', (e) => {
    e.preventDefault();  // Prevenir el comportamiento por defecto del enlace
    showSignUpForm();  // Mostrar el formulario de registro
});

signInBtnLink.addEventListener('click', (e) => {
    e.preventDefault();  // Prevenir el comportamiento por defecto del enlace
    showSignInForm();  // Mostrar el formulario de inicio de sesión
});

// Función para registrar un nuevo usuario
async function registerUser(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const username = document.querySelector('.form-wrapper.sign-up input[type="text"]').value;
    const email = document.querySelector('.form-wrapper.sign-up input[type="email"]').value;
    const password = document.querySelector('.form-wrapper.sign-up input[type="password"]').value;

    try {
        const response = await fetch('/api/registrar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        document.querySelector('.form-wrapper.sign-up form').reset(); // Reiniciar el formulario de registro
        toggleForms(); // Cambiar a la vista de inicio de sesión
    } catch (error) {
        alert(error.message);
    }
}

// Función para iniciar sesión
async function loginUser(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const username = document.querySelector('.form-wrapper.sign-in input[type="text"]').value;
    const password = document.querySelector('.form-wrapper.sign-in input[type="password"]').value;

    try {
        const response = await fetch('/api/iniciar_sesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const user = await response.json();
        alert('Inicio de sesión exitoso. Bienvenido, ' + user.username + '!');
        // Aquí puedes redirigir al usuario a otra página o realizar otra acción
    } catch (error) {
        alert(error.message);
    }
}