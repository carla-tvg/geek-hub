// routes/gestionCarrito.js
const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController'); // Importar el controlador del carrito

// Ruta para obtener los productos del carrito de un usuario
router.get('/:id', carritoController.obtenerCarrito);

// Ruta para agregar un producto al carrito de un usuario
router.post('/:id', carritoController.agregarProducto);

// Ruta para eliminar un producto del carrito de un usuario
router.delete('/:id/:productoId', carritoController.eliminarProducto);

module.exports = router;
