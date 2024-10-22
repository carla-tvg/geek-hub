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
            const productoIndex = productos.findIndex(p => p.id === id);

            if (productoIndex === -1) {
                return res.status(404).send('Producto no encontrado');
            }

            const productoEliminado = productos[productoIndex];
            const imagenPath = path.join(__dirname, '..', 'public', productoEliminado.imagen);

            fs.unlink(imagenPath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                }
            });

            productos = productos.filter(producto => producto.id !== id);

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
    const id = parseInt(req.params.id); // Asegúrate de que sea un número
    const { editarNombre, editarDescripcion, editarPrecio, editarStock } = req.body;
    const imagenNueva = req.file ? `/img-productos/${req.file.filename}` : null; // Nueva imagen si se proporciona

    console.log('Datos del formulario antes de enviar:', req.body);
    console.log('Archivo de imagen:', req.file); // Verifica si se ha subido una imagen

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

            // Crear un nuevo objeto de producto actualizado
            const productoEditado = {
                id: id, // Mantener el mismo ID
                nombre: editarNombre ? editarNombre.trim() : productos[productoIndex].nombre, // Usar el nombre del formulario o mantener el existente
                descripcion: editarDescripcion ? editarDescripcion.trim() : productos[productoIndex].descripcion, // Usar la descripción del formulario o mantener la existente
                precio: editarPrecio ? parseFloat(editarPrecio) : productos[productoIndex].precio, // Usar el precio del formulario o mantener el existente
                stock: editarStock ? parseInt(editarStock) : productos[productoIndex].stock, // Usar el stock del formulario o mantener el existente
                imagen: imagenNueva || productos[productoIndex].imagen, // Actualizar la imagen si se proporciona
            };

            console.log('Producto a guardar:', productoEditado);
            productos[productoIndex] = productoEditado; // Reemplazar el producto antiguo

            // Guardar el archivo
            fs.writeFile(dbPath, JSON.stringify({ productos }, null, 2), (err) => {
                if (err) {
                    console.error('Error al guardar el producto:', err);
                    return res.status(500).send('Error al guardar el producto');
                }
                console.log('Producto guardado correctamente en db.json:', productoEditado);
                res.status(200).json(productoEditado); // Devolver el producto editado
            });
        } catch (e) {
            console.error('Error al procesar la base de datos:', e);
            res.status(500).send('Error al procesar la base de datos');
        }
    });
};