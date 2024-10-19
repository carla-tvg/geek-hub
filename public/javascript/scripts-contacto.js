// Función para mostrar el mensaje de error
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message; // Muestra el mensaje de error
    errorElement.style.display = 'block'; // Asegúrate de que el div sea visible
}
// Función para limpiar el mensaje de error
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = ''; // Limpia el mensaje
    errorElement.style.display = 'none'; // Oculta el div de error
}

// Validación de Nombre
function validateName(name) {
    const minLength = 2;
    const namePattern = /^[a-zA-Z\s]+$/; // Solo letras y espacios

    if (name === '') {
        showError('nameError', 'El nombre es obligatorio.');
        return false;
    } else if (name.length < minLength) {
        showError('nameError', `El nombre debe tener al menos ${minLength} caracteres.`);
        return false;
    } else if (!namePattern.test(name)) {
        showError('nameError', 'El nombre solo puede contener letras y espacios.');
        return false;
    } else {
        clearError('nameError');
        return true;
    }
}

// Validación de Correo Electrónico
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email === '') {
        showError('emailError', 'El correo electrónico es obligatorio.');
        return false;
    } else if (!emailPattern.test(email)) {
        showError('emailError', 'Por favor ingresa un correo electrónico válido.');
        return false;
    } else {
        clearError('emailError');
        return true;
    }
}

// Validación de Teléfono
function validatePhone(phone) {
    const phonePattern = /^\d{10}$/;
    if (phone === '') {
        showError('phoneError', 'El teléfono es obligatorio.');
        return false;
    } else if (!phonePattern.test(phone)) {
        showError('phoneError', 'El teléfono debe tener 10 dígitos.');
        return false;
    } else {
        clearError('phoneError');
        return true;
    }
}

// Validación de Mensaje
function validateMessage(message) {
    if (message === '') {
        showError('messageError', 'El mensaje es obligatorio.');
        return false;
    } else {
        clearError('messageError');
        return true;
    }
}

// Función principal de validación del formulario
function validateForm(event) {
    event.preventDefault(); // Evitar envío automático del formulario

    // Obtener valores
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validar cada campo
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isMessageValid = validateMessage(message);

    // Enviar formulario si todo es válido
    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
        // Enviar formulario a Formspree
        alert('Formulario enviado correctamente.');
        document.getElementById('contact-form').submit(); // Enviar formulario
        
        // Limpiar los campos después de enviar
        document.getElementById('contact-form').reset();
    }
}

// Agregar el event listener al formulario
document.getElementById('contact-form').addEventListener('submit', validateForm);
