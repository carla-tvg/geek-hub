// controllers/carritoController.js
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/carrito.json');

// Leer el archivo JSON de carritos
function leerCarrito() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Guardar cambios en el archivo JSON de carritos
function guardarCarrito(carrito) {
    fs.writeFileSync(filePath, JSON.stringify(carrito, null, 2));
}

// Obtener los productos del carrito de un usuario
exports.obtenerCarrito = (req, res) => {
    const carritos = leerCarrito();
    const carrito = carritos.find(c => c.usuarioId === req.params.id);
    if (carrito) {
        res.json(carrito);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
};

// Agregar un producto al carrito
exports.agregarProducto = (req, res) => {
    const carritos = leerCarrito();
    const carrito = carritos.find(c => c.usuarioId === req.params.id);
    const producto = req.body;
    
    if (carrito) {
        carrito.productos.push(producto);
    } else {
        carritos.push({ usuarioId: req.params.id, productos: [producto] });
    }
    
    guardarCarrito(carritos);
    res.status(201).json({ message: 'Producto agregado al carrito' });
};

// Eliminar un producto del carrito
exports.eliminarProducto = (req, res) => {
    const carritos = leerCarrito();
    const carrito = carritos.find(c => c.usuarioId === req.params.id);
    
    if (carrito) {
        carrito.productos = carrito.productos.filter(p => p.id !== req.params.productoId);
        guardarCarrito(carritos);
        res.json({ message: 'Producto eliminado del carrito' });
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
};
