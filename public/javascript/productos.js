document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || {}; // Inicializar el carrito

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
            agregarEventosCategorias(data); // Agregar eventos a las categorías
            actualizarCarritoIcono(); // Actualizar el ícono del carrito
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });

    // Función para agregar eventos a las categorías del menú
    function agregarEventosCategorias(productos) {
        const botonesCategorias = document.querySelectorAll('.dropdown a');

        botonesCategorias.forEach(boton => {
            boton.addEventListener('click', (event) => {
                event.preventDefault(); // Evitar la acción por defecto del enlace
                const categoriaSeleccionada = event.target.getAttribute('data-category');

                // Verificar que la categoría seleccionada y los productos tengan categoría
                const productosFiltrados = productos.filter(producto => 
                    producto.categoria && 
                    producto.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
                );

                mostrarProductos(productosFiltrados); // Mostrar los productos filtrados
            });
        });
    }

    function mostrarProductos(productos) {
        const productosContainer = document.getElementById('productos');
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            // Verificar que el producto tenga nombre, precio, imagen y descripción antes de mostrarlos
            if (producto.nombre && producto.precio && producto.imagen && producto.descripcion) {
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
                                <span class="product-quantity" id="cantidad-${producto.id}">${cantidadEnCarrito}</span>
                                <button class="btn-increase" data-id="${producto.id}">+</button>
                            </div>
                        </div>
                    </div>
                `;
                productosContainer.innerHTML += productoHTML;
            }
        });

        agregarEventosCarrito(); // Agregar eventos a los botones de agregar y eliminar
    }

    function agregarEventosCarrito() {
        const botonesIncrementar = document.querySelectorAll('.btn-increase');
        const botonesDisminuir = document.querySelectorAll('.btn-decrease');

        botonesIncrementar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = e.target.getAttribute('data-id');
                carrito[idProducto] = (carrito[idProducto] || 0) + 1; // Incrementar cantidad
                actualizarCarrito(idProducto); // Actualizar carrito solo para este producto
            });
        });

        botonesDisminuir.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const idProducto = e.target.getAttribute('data-id');
                if (carrito[idProducto]) {
                    carrito[idProducto] -= 1; // Disminuir cantidad
                    if (carrito[idProducto] === 0) {
                        delete carrito[idProducto]; // Eliminar del carrito si llega a 0
                    }
                }
                actualizarCarrito(idProducto); // Actualizar carrito solo para este producto
            });
        });
    }

    function actualizarCarrito(idProducto) {
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage

        // Actualizar la cantidad del producto en la interfaz
        const cantidadElemento = document.getElementById(`cantidad-${idProducto}`);
        if (cantidadElemento) {
            cantidadElemento.textContent = carrito[idProducto] || 0;
        }

        actualizarCarritoIcono(); // Actualizar el número en la navbar
    }

    function actualizarCarritoIcono() {
        const totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
        const carritoNumero = document.getElementById('carrito-numero');
        carritoNumero.textContent = `${totalProductos}`; // Actualizar el número en la navbar
    }

    function crearEstrellas(puntuacion) {
        let estrellas = '';
        for (let i = 1; i <= 5; i++) {
            estrellas += i <= puntuacion ? '★' : '☆';
        }
        return estrellas;
    }

    function agregarEventosBusqueda(productos) {
        const searchForm = document.getElementById("searchForm");
        const searchInput = document.getElementById("searchInput");

        searchForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Evitar que se recargue la página
            const query = searchInput.value.toLowerCase();

            // Filtrar productos según la búsqueda y asegurarse que nombre y descripción existan
            const productosFiltrados = productos.filter(producto => 
                (producto.nombre && producto.nombre.toLowerCase().includes(query)) || 
                (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
            );

            mostrarProductos(productosFiltrados); // Mostrar productos filtrados
        });
    }

    function agregarEventosRecienLlegados(productos) {
        const recienLlegadosLink = document.getElementById("recienLlegados");

        recienLlegadosLink.addEventListener("click", (event) => {
            event.preventDefault(); // Evitar la acción por defecto del enlace
            const productosRecienLlegados = filtrarRecienLlegados(productos);
            mostrarProductos(productosRecienLlegados); // Mostrar productos recién llegados
        });
    }

    function filtrarRecienLlegados(productos) {
        const diasRecientes = 7; // Define cuántos días atrás consideras como "reciente"
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasRecientes);

        return productos.filter(producto => {
            const fechaLlegada = new Date(producto.fechaLlegada);
            return fechaLlegada >= fechaLimite;
        });
    }
});
