const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img-productos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// Configuración de multer con limitaciones
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes'));
    }
});

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para parsear JSON y datos URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

// Ruta para servir el archivo admin.html
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/admin.html'));
});

// Ruta para obtener los productos desde db.json
app.get('/api/productos', (req, res) => {
    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para agregar un nuevo producto con subida de imagen
app.post('/api/agregar_producto', upload.single('imagen'), (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !req.file) {
        return res.status(400).send('Faltan campos requeridos');
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        imagen: `/img-productos/${req.file.filename}`,
        categoria: "Sin categoría", // Valor por defecto
        puntuacion: 0 // Valor por defecto
    };

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        const productos = JSON.parse(data);
        productos.push(nuevoProducto);

        fs.writeFile('db.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el producto');
            }
            res.status(201).json(nuevoProducto);
        });
    });
});

// Ruta para eliminar un producto
app.delete('/api/eliminar_producto/:id', (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        let productos = JSON.parse(data);
        const productoEliminado = productos.find(p => p.id === id);
        if (productoEliminado) {
            const imagenPath = path.join(__dirname, 'public', productoEliminado.imagen);
            fs.unlink(imagenPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                }
            });
        }
        productos = productos.filter(producto => producto.id !== id);

        fs.writeFile('db.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar la base de datos');
            }
            res.status(200).json({ message: 'Producto eliminado' });
        });
    });
});

// Ruta para editar un producto
app.put('/api/editar_producto/:id', upload.single('imagen'), (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || !descripcion || !precio || !stock) {
        return res.status(400).send('Faltan campos requeridos');
    }

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        let productos = JSON.parse(data);
        const productoIndex = productos.findIndex(p => p.id === id);

        if (productoIndex === -1) {
            return res.status(404).send('Producto no encontrado');
        }

        // Si se subió una nueva imagen, manejarla
        if (req.file) {
            // Eliminar la imagen antigua
            const imagenPath = path.join(__dirname, 'public', productos[productoIndex].imagen);
            fs.unlink(imagenPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen antigua:', err);
                }
            });

            // Asignar la nueva ruta de la imagen
            productos[productoIndex].imagen = `/img-productos/${req.file.filename}`;
        }

        // Actualizar los campos del producto
        productos[productoIndex].nombre = nombre.trim();
        productos[productoIndex].descripcion = descripcion.trim();
        productos[productoIndex].precio = parseFloat(precio);
        productos[productoIndex].stock = parseInt(stock);

        fs.writeFile('db.json', JSON.stringify(productos, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el producto');
            }
            res.status(200).json(productos[productoIndex]);
        });
    });
});

// Manejar errores de Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message === 'Solo se permiten imágenes') {
        res.status(400).send(err.message);
    } else {
        next(err);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
