// admin.js

// Inicializar el array de productos
let productos = [];

// Referencia al formulario de agregar productos y a la tabla
const form = document.getElementById('productoForm');
const productosTableBody = document.getElementById('productosTable');

// Referencia al formulario de edición y al modal
const editarForm = document.getElementById('editarProductoForm');
const editarModalElement = document.getElementById('editarProductoModal');
const editarModal = new bootstrap.Modal(editarModalElement);

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

// Función para abrir el modal de edición con los datos del producto
function abrirEditar(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    // Llenar el formulario del modal con los datos del producto
    document.getElementById('editarId').value = producto.id;
    document.getElementById('editarNombre').value = producto.nombre;
    document.getElementById('editarDescripcion').value = producto.descripcion;
    document.getElementById('editarPrecio').value = producto.precio;
    document.getElementById('editarStock').value = producto.stock;
    document.getElementById('editarImagen').value = ''; // Limpiar el campo de imagen

    // Mostrar el modal
    editarModal.show();
}

// Función para manejar la edición de un producto
editarForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editarId').value);
    const nombre = document.getElementById('editarNombre').value.trim();
    const descripcion = document.getElementById('editarDescripcion').value.trim();
    const precio = parseFloat(document.getElementById('editarPrecio').value);
    const stock = parseInt(document.getElementById('editarStock').value);
    const imagen = document.getElementById('editarImagen').files[0]; // Puede ser undefined

    if (!nombre || !descripcion || isNaN(precio) || isNaN(stock)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Crear un nuevo FormData para enviar al servidor
    const dataToSend = new FormData();
    dataToSend.append('nombre', nombre);
    dataToSend.append('descripcion', descripcion);
    dataToSend.append('precio', precio);
    dataToSend.append('stock', stock);
    if (imagen) {
        dataToSend.append('imagen', imagen);
    }

    // Enviar la actualización al servidor
    fetch(`/api/editar_producto/${id}`, {
        method: 'PUT',
        body: dataToSend
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la solicitud de edición');
            return response.json();
        })
        .then(data => {
            console.log('Producto editado:', data);
            cargarProductos(); // Actualizar la lista de productos en admin.html
            editarForm.reset(); // Limpiar el formulario del modal
            editarModal.hide(); // Cerrar el modal
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Cargar los productos al inicio
window.onload = function () {
    cargarProductos();
};
