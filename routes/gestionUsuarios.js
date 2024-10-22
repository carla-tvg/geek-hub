const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController'); // Asegúrate de que la ruta es correcta

// Rutas de usuarios
router.get('/', usuariosController.obtenerUsuarios); // Obtener todos los usuarios
router.post('/', usuariosController.registrarUsuario); // Registrar un nuevo usuario
router.get('/:id', usuariosController.obtenerUsuarioPorId); // Obtener un usuario por su ID
router.delete('/:id', usuariosController.eliminarUsuario); // Eliminar un usuario por su ID

module.exports = router;
