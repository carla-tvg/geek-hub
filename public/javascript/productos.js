document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

function cargarProductos() {
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
            const productosContainer = document.getElementById('productos');
            productosContainer.innerHTML = '<p class="error-message">No se pudieron cargar los productos. Intenta nuevamente más tarde.</p>';
        });
}

function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    productos.forEach(producto => {
        const puntuacionValidada = Math.min(Math.max(producto.puntuacion, 0), 5);
        const estrellasHTML = crearEstrellas(puntuacionValidada);
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
                    <a href="detalle.html?id=${producto.id}" class="add-cart">Ver Detalle</a>
                </div>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });
}

function crearEstrellas(puntuacion) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
        estrellas += i <= puntuacion ? '★' : '☆'; // Estrella llena o vacía
    }
    return estrellas;
}
