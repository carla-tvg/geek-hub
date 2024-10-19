const express = require('express');
const router = express.Router();

// Importamos el controlador de categorías
const categoriasController = require('../controllers/categoriasController');

// Ruta para obtener todas las categorías
router.get('/', categoriasController.obtenerCategorias);

// Ruta para obtener una categoría por ID
router.get('/:id', categoriasController.obtenerCategoriaPorId);

// Ruta para crear una nueva categoría
router.post('/crear', categoriasController.crearCategoria);

// Ruta para editar una categoría existente
router.put('/editar/:id', categoriasController.editarCategoria);

// Ruta para eliminar una categoría
router.delete('/eliminar/:id', categoriasController.eliminarCategoria);

module.exports = router;
