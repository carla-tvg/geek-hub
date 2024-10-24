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
        <td>${(producto.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
        <td>${producto.stock}</td>
        <td><img src="${producto.imagen.startsWith('/') ? producto.imagen : '/' + producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${producto.id})">Eliminar</button>
            <button class="btn btn-secondary btn-sm" onclick="abrirEditar(${producto.id})">Editar</button>
        </td>
    `;
    productosTableBody.appendChild(row);
}

// Función para cargar los productos desde el servidor
function cargarProductos() {
    fetch('/api/productos?timestamp=' + new Date().getTime()) // Evitar caché
        .then(response => {
            if (!response.ok) throw new Error('Error al obtener productos');
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
            alert('No se pudieron cargar los productos. Inténtalo más tarde.');
        });
}

// Función para agregar un producto al servidor y actualizar la tabla
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const nombreProducto = formData.get('nombre').trim();
    const descripcionProducto = formData.get('descripcion').trim();
    const precioProducto = parseFloat(formData.get('precio'));
    const stockProducto = parseInt(formData.get('stock'));
    const imagenProducto = formData.get('imagen');

    if (!nombreProducto || !descripcionProducto || isNaN(precioProducto) || !imagenProducto || isNaN(stockProducto)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Enviar el nuevo producto al servidor
    fetch('/api/productos/agregar_producto', {
        method: 'POST',
        body: formData
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
        alert('No se pudo agregar el producto. Inténtalo más tarde.');
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
    fetch(`/api/productos/eliminar_producto/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al eliminar el producto');
        console.log('Producto eliminado');
        cargarProductos(); // Actualizar la lista de productos
    })
    .catch(error => {
        console.error('Error al eliminar el producto:', error);
        alert('No se pudo eliminar el producto. Inténtalo más tarde.');
    });
}

function abrirEditar(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        document.getElementById('editarId').value = producto.id;
        document.getElementById('editarNombre').value = producto.nombre;
        document.getElementById('editarDescripcion').value = producto.descripcion;
        document.getElementById('editarPrecio').value = producto.precio;
        document.getElementById('editarStock').value = producto.stock;
        $('#editarProductoModal').modal('show'); // Muestra el modal
    }
}

document.getElementById('editarProductoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que se recargue la página
    const formData = new FormData(this);
    const id = formData.get('editarId');

    // Verifica si se ha seleccionado una nueva imagen
    const imagenInput = document.getElementById('editarImagen');
    if (imagenInput.files.length === 0) {
        formData.delete('imagen'); // No envía el campo de imagen si no se selecciona una nueva
    }

    fetch(`/api/productos/editar_producto/${id}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al editar el producto');
        return response.json();
    })
    .then(data => {
        console.log('Producto editado:', data);
        cargarProductos(); // Actualiza la lista de productos
        $('#editarProductoModal').modal('hide'); // Cierra el modal
    })
    .catch(error => {
        console.error('Error al editar:', error);
        alert('No se pudo editar el producto. Inténtalo más tarde.');
    });
});

// Evento para cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    document.getElementById('editarProductoForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const formData = new FormData(this); // Obtener los datos del formulario
        const imagenInput = document.getElementById('editarImagen');

        const id = formData.get('editarId');

        // Verificar si se ha seleccionado un archivo
        // Solo mostrar la alerta si se ha seleccionado una nueva imagen
        if (imagenInput.files.length === 0) {
            // Si no hay nueva imagen, eliminamos el campo de la FormData
            formData.delete('imagen');
        }

        // Log para ver los datos que se están enviando
        console.log('Datos del formulario antes de enviar:', Object.fromEntries(formData));

        // Realizar la solicitud fetch para editar el producto
        fetch(`/api/productos/editar_producto/${id}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Error al editar el producto');
            return response.json(); // Parsear la respuesta como JSON
        })
        .then(data => {
            console.log('Producto editado:', data);
            cargarProductos(); // Actualizar la lista de productos
            $('#editarProductoModal').modal('hide'); // Cerrar el modal de edición
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`No se pudo editar el producto. Error: ${error.message}`);
        });
    });

    // Lógica para el botón de cerrar sesión
    const cerrarSesionBtn = document.getElementById("cerrarSesion");
    cerrarSesionBtn.addEventListener("click", function () {
        // Aquí puedes manejar la lógica de cierre de sesión
        alert("Cerrando sesión...");
        
        // Redirigir a la página de inicio de sesión
        window.location.href = "/admin/login"; // Asegúrate de que la ruta sea correcta
    });
});
