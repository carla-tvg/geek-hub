const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController'); // Ajusta la ruta según sea necesario

// Ruta para manejar el inicio de sesión
router.post('/', loginController.login); // Asume que el controlador tiene una función 'login'

// Exportar el router
module.exports = router;
