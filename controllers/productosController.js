const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'db.json'); // Ruta para el archivo db.json

exports.obtenerProductos = (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        try {
            const productos = JSON.parse(data).productos || []; 
            res.json(productos);
        } catch (e) {
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};

exports.agregarProducto = (req, res) => {
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
        categoria: "Sin categoría",
        puntuacion: 0
    };

    fs.readFile(dbPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        try {
            const productos = JSON.parse(data).productos || [];
            productos.push(nuevoProducto);

            fs.writeFile(dbPath, JSON.stringify({ productos }, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar el producto');
                }
                res.status(201).json(nuevoProducto);
            });
        } catch (e) {
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};

exports.eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile(dbPath, (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        try {
            let productos = JSON.parse(data).productos || [];
            const productoEliminado = productos.find(p => p.id === id);

            if (productoEliminado) {
                const imagenPath = path.join(__dirname, '..', 'public', productoEliminado.imagen);
                fs.unlink(imagenPath, (err) => {
                    if (err) {
                        console.error('Error al eliminar la imagen:', err);
                    }
                });
            }

            productos = productos.filter(producto => producto.id !== id);

            fs.writeFile(dbPath, JSON.stringify({ productos }, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar la base de datos');
                }
                res.status(200).json({ message: 'Producto eliminado', productoEliminado });
            });
        } catch (e) {
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};
