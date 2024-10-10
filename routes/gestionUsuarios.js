// gestionUsuarios.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController'); // Asegúrate de que la ruta es correcta

// Rutas de usuarios
router.get('/', usuariosController.obtenerUsuarios);
router.post('/', usuariosController.registrarUsuario);
router.delete('/', usuariosController.eliminarUsuario);

module.exports = router;
