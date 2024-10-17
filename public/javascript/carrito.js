// carrito.js

document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || {}; // Inicializar el carrito

    function cargarCarrito() {
        const carritoContainer = document.getElementById('carrito');
        carritoContainer.innerHTML = ''; // Limpiar el contenedor

        if (Object.keys(carrito).length === 0) {
            carritoContainer.innerHTML = '<p>No hay productos en el carrito.</p>';
            return;
        }

        // Aquí asumimos que tienes una API para obtener detalles de los productos por IDs
        const idsProductos = Object.keys(carrito);
        fetch('/api/productos') // O una API específica para obtener múltiples productos por ID
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los productos');
                }
                return response.json();
            })
            .then(productos => {
                const productosFiltrados = productos.filter(producto => idsProductos.includes(producto.id));
                productosFiltrados.forEach(producto => {
                    const cantidad = carrito[producto.id];
                    const productoHTML = `
                        <div class="carrito-item">
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="carrito-imagen">
                            <div class="carrito-info">
                                <h3>${producto.nombre}</h3>
                                <p>Precio: $${Number(producto.precio).toLocaleString('es-CO')}</p>
                                <p>Cantidad: ${cantidad}</p>
                                <button class="btn-remove" data-id="${producto.id}">Eliminar</button>
                            </div>
                        </div>
                    `;
                    carritoContainer.innerHTML += productoHTML;
                });

                agregarEventosEliminar(); // Agregar eventos para eliminar productos
            })
            .catch(error => {
                console.error('Error:', error);
                carritoContainer.innerHTML = '<p>Error al cargar los productos del carrito.</p>';
            });
    }

    // Función para eliminar un producto del carrito
    function eliminarProducto(idProducto) {
        if (carrito[idProducto]) {
            delete carrito[idProducto];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
            actualizarCarritoIcono(); // Actualizar el ícono del carrito en todas las páginas
        }
    }

    // Función para agregar eventos a los botones de eliminar
    function agregarEventosEliminar() {
        const botonesEliminar = document.querySelectorAll('.btn-remove');

        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = e.target.getAttribute('data-id');
                eliminarProducto(idProducto);
            });
        });
    }

    // Función para actualizar el número de productos en el carrito
    function actualizarCarritoIcono() {
        const carritoIcono = document.querySelector('.fa-shopping-cart');
        const totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
        carritoIcono.setAttribute('data-count', totalProductos); // Mostrar el total en el ícono
        const cartCountSpan = document.getElementById('cart-count');
        if (cartCountSpan) {
            cartCountSpan.textContent = totalProductos;
        }
    }

    cargarCarrito();
});
