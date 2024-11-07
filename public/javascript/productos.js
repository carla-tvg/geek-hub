
// Inicializar el carrito desde el localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || {};

// Escucha cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos()
        .then(data => {
            mostrarProductos(data);
            agregarEventosBusqueda(data);
            agregarEventosRecienLlegados(data);
            agregarEventosCategorias(data);
            actualizarCarritoIcono();
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
});

// Función para cargar productos desde el API
async function cargarProductos() {
    const response = await fetch('/api/productos');
    if (!response.ok) throw new Error('Error en la red');
    return await response.json();
}

// Función para mostrar productos
function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        // Verificar que el producto tenga los datos necesarios
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
                            <button class="btn-decrease" data-id="${producto.id}">−</button>
                            <span class="product-quantity" id="cantidad-${producto.id}">${cantidadEnCarrito}</span>
                            <button class="btn-increase" data-id="${producto.id}">+</button>
                        </div>
                        <button class="btn-secondary" data-id="${producto.id}">Añadir al Carrito</button>
                    </div>
                </div>
            `;
            productosContainer.innerHTML += productoHTML;
        }
    });

    agregarEventosCarrito(); // Agregar eventos a los botones de agregar y eliminar
}

// Función para agregar eventos a botones del carrito
function agregarEventosCarrito() {
    const botonesIncrementar = document.querySelectorAll('.btn-increase');
    const botonesDisminuir = document.querySelectorAll('.btn-decrease');
    const botonesAgregarCarrito = document.querySelectorAll('.btn-secondary');

    botonesIncrementar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idProducto = e.target.getAttribute('data-id');
            carrito[idProducto] = (carrito[idProducto] || 0) + 1;
            actualizarCarrito(idProducto);
        });
    });

    botonesDisminuir.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const idProducto = e.target.getAttribute('data-id');
            if (carrito[idProducto]) {
                carrito[idProducto]--;
                if (carrito[idProducto] === 0) delete carrito[idProducto];
                actualizarCarrito(idProducto);
            }
        });
    });

    botonesAgregarCarrito.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            carrito[productId] = (carrito[productId] || 0) + 1;
            actualizarCarrito(productId);
        });
    });
}

// Función para actualizar el carrito en localStorage y en el DOM
function actualizarCarrito(idProducto) {
    localStorage.setItem('carrito', JSON.stringify(carrito));

    const cantidadElemento = document.getElementById(`cantidad-${idProducto}`);
    if (cantidadElemento) {
        cantidadElemento.textContent = carrito[idProducto] || 0;
    }

    actualizarCarritoIcono();
}

// Función para actualizar el ícono del carrito en la navbar
function actualizarCarritoIcono() {
    const totalProductos = Object.values(carrito).reduce((acc, cantidad) => acc + cantidad, 0);
    const carritoNumero = document.getElementById('carrito-numero');
    carritoNumero.textContent = `${totalProductos}`;
}

// Función para crear estrellas de puntuación
function crearEstrellas(puntuacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        estrellas += i <= puntuacion ? '★' : '☆';
    }
    return estrellas;
}

// Función para agregar eventos de búsqueda
function agregarEventosBusqueda(productos) {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.toLowerCase();
        const productosFiltrados = productos.filter(producto =>
            (producto.nombre && producto.nombre.toLowerCase().includes(query)) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(query))
        );

        mostrarProductos(productosFiltrados);
    });
}

// Función para agregar eventos de recién llegados
function agregarEventosRecienLlegados(productos) {
    const recienLlegadosLink = document.getElementById("recienLlegados");

    recienLlegadosLink.addEventListener("click", (event) => {
        event.preventDefault();
        const productosRecienLlegados = filtrarRecienLlegados(productos);
        mostrarProductos(productosRecienLlegados);
    });
}

// Función para filtrar productos recién llegados
function filtrarRecienLlegados(productos) {
    const diasRecientes = 7;
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasRecientes);

    return productos.filter(producto => {
        const fechaLlegada = new Date(producto.fechaLlegada);
        return fechaLlegada >= fechaLimite;
    });
}

// Función para agregar eventos de categorías
function agregarEventosCategorias(productos) {
    const botonesCategorias = document.querySelectorAll('.dropdown a[data-category]');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', (event) => {
            event.preventDefault();
            const categoriaSeleccionada = event.target.getAttribute('data-category');

            const productosFiltrados = productos.filter(producto =>
                producto.categoria &&
                producto.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
            );

            mostrarProductos(productosFiltrados);
        });
    });
}
