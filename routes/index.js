const express = require('express');
const router = express.Router();
const path = require('path');

const productosRoutes = require('./productos'); // Asegúrate de que esta línea esté presente

// Ruta para servir el archivo index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Ruta para servir el archivo admin.html
router.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin.html'));
});

// Ruta para servir el archivo usuarios.html
router.get('/usuarios.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/usuarios.html'));
});

// Usar las rutas de productos
router.use('/api', productosRoutes); // Asegúrate de que esta línea esté presente

module.exports = router;
