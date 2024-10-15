document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            mostrarProductos(data);
            agregarEventosBusqueda(data); // Añadir eventos de búsqueda
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
});

// Función para mostrar productos
function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    productos.forEach(producto => {
        const estrellasHTML = crearEstrellas(producto.puntuacion);
        const productoHTML = `<div class="product-card">
                <div class="img-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                </div>
                <div class="info-container">
                    <h3 class="product-name">${producto.nombre}</h3>
                    <p class="product-description">${producto.descripcion}</p>
                    <strong class="product-price">$${Number(producto.precio).toLocaleString('es-CO')}</strong>
                    <span class="product-rating">${estrellasHTML}</span>
                    <a href="detalle.html?id=${producto.id}" class="add-cart">Ver Detalle</a>
                </div>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });
}

// Función para crear estrellas
function crearEstrellas(puntuacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= puntuacion) {
            estrellas += '★'; // Estrella llena
        } else {
            estrellas += '☆'; // Estrella vacía
        }
    }
    return estrellas;
}

// Función para agregar eventos de búsqueda
function agregarEventosBusqueda(productos) {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar que se recargue la página
        const query = searchInput.value.toLowerCase();

        // Filtrar productos según la búsqueda
        const productosFiltrados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(query) || 
            producto.descripcion.toLowerCase().includes(query)
        );

        mostrarProductos(productosFiltrados); // Mostrar productos filtrados
    });
}
