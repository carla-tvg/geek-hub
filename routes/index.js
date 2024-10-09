const express = require('express');
const router = express.Router();
const path = require('path');

const productosRoutes = require('./gestionProductos'); 
const usuariosRoutes = require('./gestionUsuarios'); // Importar rutas de usuarios

// Ruta para servir el archivo index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Ruta para servir el archivo admin/gestionProductos.html
router.get('/admin/gestionProductos.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionProductos.html'));
});

// Ruta para servir la gestión de usuarios
router.get('/admin/gestionUsuarios.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionUsuarios.html'));
});

// Ruta para servir el archivo registro.html
router.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/registro.html'));
});

// Usar las rutas de productos bajo /api/productos
router.use('/api/productos', productosRoutes);

// Usar las rutas de usuarios bajo /api/usuarios
router.use('/api/usuarios', usuariosRoutes); // Agregar esta línea

module.exports = router;
