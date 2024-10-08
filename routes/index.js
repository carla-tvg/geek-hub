const express = require('express');
const router = express.Router();
const path = require('path');

const productosRoutes = require('./gestionProductos'); 

// Ruta para servir el archivo index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Ruta para servir el archivo admin/gestionProductos.html
router.get('/admin/gestionProductos.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionProductos.html'));
});

// Usar las rutas de productos bajo /api/productos
router.use('/api/productos', productosRoutes);

module.exports = router;
