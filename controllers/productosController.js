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

    // Validar que todos los campos requeridos están presentes y son correctos
    if (!nombre || !descripcion || !precio || !stock || !req.file) {
        return res.status(400).send('Faltan campos requeridos');
    }

    // Asegúrate de que precio y stock sean números
    const precioNum = parseFloat(precio);
    const stockNum = parseInt(stock);

    if (isNaN(precioNum) || isNaN(stockNum)) {
        return res.status(400).send('Precio y stock deben ser números');
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: precioNum,
        stock: stockNum,
        imagen: `/img-productos/${req.file.filename}`,
        categoria: "Sin categoría", // Puedes cambiar esto según tu lógica
        puntuacion: 0 // Valor por defecto
    };

    // Guardar el nuevo producto en el archivo db.json
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
            const productoIndex = productos.findIndex(p => p.id === id); // Busca el índice del producto a eliminar

            if (productoIndex === -1) {
                return res.status(404).send('Producto no encontrado');
            }

            // Si se encuentra, eliminar la imagen
            const productoEliminado = productos[productoIndex];
            const imagenPath = path.join(__dirname, '..', 'public', productoEliminado.imagen);

            // Intentar eliminar la imagen del sistema de archivos
            fs.unlink(imagenPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                    // Aun así continuamos eliminando el producto
                }
            });

            // Filtrar el producto a eliminar
            productos = productos.filter(producto => producto.id !== id);

            // Guardar los cambios en db.json
            fs.writeFile(dbPath, JSON.stringify({ productos }, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error al guardar la base de datos');
                }
                res.status(200).json({ message: 'Producto eliminado', productoEliminado });
            });
        } catch (e) {
            console.error('Error al procesar la base de datos:', e);
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};

exports.editarProducto = (req, res) => {
    console.log('Solicitud PUT recibida para editar producto con ID:', req.params.id);
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, stock } = req.body;
    const imagenNueva = req.file ? `/img-productos/${req.file.filename}` : null;

    fs.readFile(dbPath, (err, data) => {
        if (err) {
            console.error('Error al leer la base de datos:', err);
            return res.status(500).send('Error al leer la base de datos');
        }

        try {
            let productos = JSON.parse(data).productos || [];
            const productoIndex = productos.findIndex(p => p.id === id);

            if (productoIndex === -1) {
                console.log('Producto no encontrado con ID:', id);
                return res.status(404).send('Producto no encontrado');
            }

            // Mantener los valores existentes y actualizar solo los que se envían
            const productoActualizado = {
                ...productos[productoIndex],
                ...(nombre && { nombre: nombre.trim() }),
                ...(descripcion && { descripcion: descripcion.trim() }),
                ...(precio && { precio: parseFloat(precio) }),
                ...(stock && { stock: parseInt(stock) }),
                imagen: imagenNueva || productos[productoIndex].imagen // Mantener la imagen actual si no se proporciona una nueva
            };

            productos[productoIndex] = productoActualizado;

            fs.writeFile(dbPath, JSON.stringify({ productos }, null, 2), (err) => {
                if (err) {
                    console.error('Error al guardar el producto:', err);
                    return res.status(500).send('Error al guardar el producto');
                }
                console.log('Producto actualizado:', productoActualizado);
                res.status(200).json(productoActualizado);
            });
        } catch (e) {
            console.error('Error al procesar la base de datos:', e);
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};