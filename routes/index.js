// routes/index.js
const express = require('express');
const router = express.Router();
const path = require('path');


const productosRoutes = require('./gestionProductos'); 
const usuariosRoutes = require('./gestionUsuarios'); 
const gestionLogin = require('./gestionLogin');
const adminsRoutes = require('./admins'); // Importa el archivo admins.js
const carritoRoutes = require('./gestionCarrito'); 

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

// Ruta para servir el formulario de login de administradores
router.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/loginAdmin.html'));
});

router.get('/admin/panelAdmin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/panelAdmin.html'));
});

router.get('/admin/panelEcommerce.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/panelEcommerce.html'));
});

router.get('/admin/gestionEcommerce.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/admin/gestionEcommerce.html'));
});

// Usar las rutas de productos bajo /api/productos
router.use('/api/productos', productosRoutes);

// Usar las rutas de usuarios bajo /api/usuarios
router.use('/api/usuarios', usuariosRoutes);

// Usar las rutas de inicio de sesión bajo /api/login
router.use('/api/login', gestionLogin); // Define la ruta base para las funciones de login

// Usar las rutas de administradores bajo /api/admin
router.use('/api/admin', adminsRoutes); // Define la ruta base para las funciones de admin

router.get('/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/carrito.html'));
});

// Usar las rutas del carrito bajo /api/carrito
router.use('/api/carrito', carritoRoutes);

module.exports = router;
