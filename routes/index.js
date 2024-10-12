// routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path');

const productosRoutes = require('./gestionProductos'); 
const usuariosRoutes = require('./gestionUsuarios'); 
const gestionLogin = require('./gestionLogin');

// Ruta para servir el archivo index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Rutas para otros archivos
router.get('/admin/gestionProductos.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionProductos.html'));
});

router.get('/admin/gestionUsuarios.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionUsuarios.html'));
});

router.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/registro.html'));
});

// Usar las rutas de productos bajo /api/productos
router.use('/api/productos', productosRoutes);

// Usar las rutas de usuarios bajo /api/usuarios
router.use('/api/usuarios', usuariosRoutes);

// Usar las rutas de inicio de sesión bajo /api/login
router.use('/api/login', gestionLogin); // Define la ruta base para las funciones de login

module.exports = router;
