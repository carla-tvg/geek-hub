const fs = require('fs');
const path = require('path');

exports.obtenerProductos = (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        // Asumiendo que la estructura de db.json es { "productos": [...] }
        const productos = JSON.parse(data).productos; 
        res.json(productos); // Devolver solo el array de productos
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
        categoria: "Sin categoría", // Valor por defecto
        puntuacion: 0 // Valor por defecto
    };

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        const productos = JSON.parse(data).productos; // Cambiar esto para adaptarse a la estructura
        productos.push(nuevoProducto);

        fs.writeFile('db.json', JSON.stringify({ productos }, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar el producto');
            }
            res.status(201).json(nuevoProducto);
        });
    });
};

exports.eliminarProducto = (req, res) => {
    const id = parseInt(req.params.id);

    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }

        let productos = JSON.parse(data).productos; // Cambiar esto para adaptarse a la estructura
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

        fs.writeFile('db.json', JSON.stringify({ productos }, null, 2), (err) => { // Cambiar esto para adaptarse a la estructura
            if (err) {
                return res.status(500).send('Error al guardar la base de datos');
            }
            res.status(200).json({ message: 'Producto eliminado' });
        });
    });
};

