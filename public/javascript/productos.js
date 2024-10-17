document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || {}; // Inicializar carrito

    // Cargar productos desde el servidor
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            mostrarProductos(data);
            agregarEventosBusqueda(data);
            agregarEventosRecienLlegados(data);
            actualizarCarritoIcono(); // Actualizar ícono carrito
        })
        .catch(error => console.error('Error con la petición Fetch:', error));

    // Mostrar productos en la página
    function mostrarProductos(productos) {
        const productosContainer = document.getElementById('productos');
        productosContainer.innerHTML = ''; // Limpiar el contenedor

        productos.forEach(producto => {
            const estrellasHTML = crearEstrellas(producto.puntuacion);
            const cantidadEnCarrito = carrito[producto.id] || 0;
            const productoHTML = `
                <div class="product-card">
                    <div class="img-container">
                        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                    </div>
                    <div class="info-container">
                        <h3 class="product-name">${producto.nombre}</h3>
                        <p class="product-description">${producto.descripcion}</p>
                        <strong class="product-price">$${Number(producto.precio).toLocaleString('es-CO')}</strong>
                        <span class="product-rating">${estrellasHTML}</span>
                        <div class="cart-actions">
                            <button class="btn-decrease" data-id="${producto.id}">-</button>
                            <span class="product-quantity">${cantidadEnCarrito}</span>
                            <button class="btn-increase" data-id="${producto.id}">+</button>
                        </div>
                    </div>
                </div>`;
            productosContainer.innerHTML += productoHTML; // Agregar producto al contenedor
        });

        // Agregar eventos para carrito
        agregarEventosCarrito();
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage
        actualizarCarritoIcono(); // Actualizar ícono del carrito
    }

    // Actualizar el ícono del carrito
    function actualizarCarritoIcono() {
        const carritoIcono = document.querySelector('.fa-shopping-cart');
        const totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
        carritoIcono.setAttribute('data-count', totalProductos);
    }

    // Agregar eventos al carrito
    function agregarEventosCarrito() {
        document.querySelectorAll('.btn-increase').forEach(boton => {
            boton.addEventListener('click', e => {
                const idProducto = e.target.getAttribute('data-id');
                carrito[idProducto] = (carrito[idProducto] || 0) + 1; // Incrementar cantidad
                actualizarCarrito();
            });
        });

        document.querySelectorAll('.btn-decrease').forEach(boton => {
            boton.addEventListener('click', e => {
                const idProducto = e.target.getAttribute('data-id');
                if (carrito[idProducto]) {
                    carrito[idProducto] -= 1; // Disminuir cantidad
                    if (carrito[idProducto] === 0) {
                        delete carrito[idProducto]; // Eliminar si es 0
                    }
                }
                actualizarCarrito();
            });
        });
    }

    // Crear estrellas según la puntuación
    function crearEstrellas(puntuacion) {
        let estrellas = '';
        for (let i = 1; i <= 5; i++) {
            estrellas += i <= puntuacion ? '★' : '☆'; // Asignar estrellas
        }
        return estrellas;
    }

    // Búsqueda de productos
    function agregarEventosBusqueda(productos) {
        const searchForm = document.getElementById("searchForm");
        const searchInput = document.getElementById("searchInput");

        searchForm.addEventListener("submit", event => {
            event.preventDefault(); // Evitar recarga
            const query = searchInput.value.toLowerCase();
            const productosFiltrados = productos.filter(producto => 
                producto.nombre.toLowerCase().includes(query) || 
                producto.descripcion.toLowerCase().includes(query)
            );
            mostrarProductos(productosFiltrados); // Mostrar productos filtrados
        });
    }

    // Recién llegados
    function agregarEventosRecienLlegados(productos) {
        document.getElementById('recienLlegados').addEventListener('click', event => {
            event.preventDefault(); // Evitar acción por defecto
            const productosRecientes = filtrarRecienLlegados(productos);
            mostrarProductos(productosRecientes); // Mostrar productos recientes
        });
    }

    function filtrarRecienLlegados(productos) {
        const diasRecientes = 7;
        const fechaActual = new Date();
        const fechaLimite = new Date(fechaActual.setDate(fechaActual.getDate() - diasRecientes)); // Calcular fecha límite
    
        return productos.filter(producto => {
            if (!producto.fechaLlegada) return false; // Si no hay fecha, ignorar el producto
            const fechaLlegada = new Date(producto.fechaLlegada); // Convertir a objeto Date
            return fechaLlegada >= fechaLimite; // Filtrar productos que llegaron después de la fecha límite
        });
    }
});
