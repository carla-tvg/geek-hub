const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController'); // Importar el controlador de productos
const multer = require('multer');

//multer configurado en el controlador
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img-productos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = require('path').extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(require('path').extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes'));
    }
});

// Definir rutas de productos
router.get('/productos', productosController.obtenerProductos); // Cambiado aquí
router.post('/agregar_producto', upload.single('imagen'), productosController.agregarProducto);
router.delete('/eliminar_producto/:id', productosController.eliminarProducto);


module.exports = router;
