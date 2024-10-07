const express = require('express');
const router = express.Router();
const path = require('path');

const productosRoutes = require('./productos'); 

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



router.use('/api', productosRoutes);  //llamado de productos

module.exports = router;
