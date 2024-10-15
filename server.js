const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs').promises; // Usar promesas para fs
const path = require('path');
const multer = require('multer');

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img-productos/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

// Ruta para servir el archivo admin.html
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/admin.html'));
});

// Ruta para servir el archivo carrito.html
app.get('/carrito.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/carrito.html'));
});


// Ruta para obtener los productos desde db.json
app.get('/api/productos', async (req, res) => {
    try {
        const data = await fs.readFile('db.json');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).send('Error al leer la base de datos');
    }
});

// Ruta para agregar un nuevo producto con subida de imagen
app.post('/api/agregar_producto', upload.single('imagen'), async (req, res) => {
    const nuevoProducto = req.body;

    if (!req.file) {
        return res.status(400).send('No se subió ninguna imagen');
    }

    nuevoProducto.imagen = `/img-productos/${req.file.filename}`;
    nuevoProducto.id = Date.now();

    try {
        const data = await fs.readFile('db.json');
        const productos = JSON.parse(data);
        productos.push(nuevoProducto);
        await fs.writeFile('db.json', JSON.stringify(productos, null, 2));
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(500).send('Error al guardar el producto');
    }
});

// Ruta para eliminar un producto
app.delete('/api/eliminar_producto/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const data = await fs.readFile('db.json');
        let productos = JSON.parse(data);
        const productoEliminado = productos.find(p => p.id === id);

        if (productoEliminado) {
            const imagenPath = path.join(__dirname, 'public', productoEliminado.imagen);
            await fs.unlink(imagenPath).catch(err => {
                console.error('Error al eliminar la imagen:', err);
            });
        }

        productos = productos.filter(producto => producto.id !== id);
        await fs.writeFile('db.json', JSON.stringify(productos, null, 2));
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).send('Error al guardar la base de datos');
    }
});

// Ruta para agregar productos al carrito en carrito.json
app.post('/api/carrito', async (req, res) => {
    const nuevoProducto = req.body;

    try {
        // Leer el contenido actual del carrito
        const data = await fs.readFile('carrito.json');
        let carrito = JSON.parse(data.length > 0 ? data : '[]');

        // Verificar si el producto ya está en el carrito
        const existingItem = carrito.find(item => item.id === nuevoProducto.id);

        if (existingItem) {
            // Si ya existe, aumentar la cantidad
            existingItem.cantidad += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            nuevoProducto.cantidad = 1;
            carrito.push(nuevoProducto);
        }

        // Guardar el carrito actualizado
        await fs.writeFile('carrito.json', JSON.stringify(carrito, null, 2));
        res.status(201).json(carrito);
    } catch (err) {
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Ruta para obtener el contenido del carrito
app.get('/api/carrito', async (req, res) => {
    try {
        const data = await fs.readFile('carrito.json');
        const carrito = JSON.parse(data.length > 0 ? data : '[]');
        res.json(carrito);
    } catch (err) {
        res.status(500).send('Error al leer el carrito');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
