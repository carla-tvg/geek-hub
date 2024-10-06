// admin.js

// Inicializar el array de productos
let productos = [];

// Referencia al formulario de agregar productos y a la tabla
const form = document.getElementById('productoForm');
const productosTableBody = document.getElementById('productosTable');


// Función para agregar un producto a la tabla de administración
function agregarProductoTabla(producto) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${(producto.precio / 1000).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
        <td>${producto.stock}</td>
        <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${producto.id})">Eliminar</button>
            <button class="btn btn-secondary btn-sm ms-2" onclick="abrirEditar(${producto.id})">Editar</button>
        </td>
    `;
    productosTableBody.appendChild(row);
}

// Función para cargar los productos desde el servidor
function cargarProductos() {
    fetch('/api/productos?timestamp=' + new Date().getTime()) // Evitar caché
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar la tabla antes de llenarla
            productosTableBody.innerHTML = '';
            productos = data; // Guardar productos en el array
            productos.forEach(producto => agregarProductoTabla(producto));
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Función para agregar un producto al servidor y actualizar la tabla
form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Crear un objeto FormData a partir del formulario
    const formData = new FormData(form);

    // Validación simple
    const nombreProducto = formData.get('nombre').trim();
    const descripcionProducto = formData.get('descripcion').trim();
    const precioProducto = parseFloat(formData.get('precio'));
    const stockProducto = parseInt(formData.get('stock'));
    const imagenProducto = formData.get('imagen');

    if (!nombreProducto || !descripcionProducto || isNaN(precioProducto) || !imagenProducto || isNaN(stockProducto)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Crear un nuevo FormData para enviar al servidor
    const dataToSend = new FormData();
    dataToSend.append('nombre', nombreProducto);
    dataToSend.append('descripcion', descripcionProducto);
    dataToSend.append('precio', precioProducto);
    dataToSend.append('stock', stockProducto);
    dataToSend.append('imagen', formData.get('imagen')); // Archivo de imagen

    // Enviar el nuevo producto al servidor
    fetch('/api/agregar_producto', {
        method: 'POST',
        body: dataToSend
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la solicitud');
            return response.json();
        })
        .then(data => {
            console.log('Producto agregado:', data);
            cargarProductos(); // Actualizar la lista de productos
            form.reset(); // Limpiar el formulario
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Función para confirmar la eliminación de un producto
function confirmarEliminar(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto con ID "${id}"?`)) {
        eliminarProducto(id);
    }
}

// Función para eliminar un producto del servidor y actualizar la tabla
function eliminarProducto(id) {
    fetch(`/api/eliminar_producto/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar el producto');
            console.log('Producto eliminado');
            cargarProductos(); // Actualizar la lista de productos
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
}


// Cargar los productos al inicio
window.onload = function () {
    cargarProductos();
};
