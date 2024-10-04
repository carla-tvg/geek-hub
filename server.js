const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Importar multer

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img-productos/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Renombrar el archivo para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para parsear JSON
app.use(express.json());

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
    const nuevoProducto = req.body;

    // Validar si se subió una imagen
    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen');
    }

    // Asignar la ruta de la imagen al producto
    nuevoProducto.imagen = `/img-productos/${req.file.filename}`;
    nuevoProducto.id = Date.now(); // Generar un ID único

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
    const id = parseInt(req.params.id); // Obtener el ID del producto a eliminar

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        let productos = JSON.parse(data);
        // Filtrar el producto que se desea eliminar
        const productoEliminado = productos.find(p => p.id === id);
        if (productoEliminado) {
            // Eliminar la imagen del servidor
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
            res.status(200).json({ message: 'Producto eliminado' }); // Respuesta de éxito
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
