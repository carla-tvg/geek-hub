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
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
});

function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    
    productos.forEach(producto => {
        const estrellasHTML = crearEstrellas(producto.puntuacion);
        const productoHTML = `
            <div class="card"> <!-- Cambié 'product-card' a 'card' -->
                <div class="img-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                </div>
                <div class="info-container"> <!-- Añadido contenedor de información -->
                    <h3 class="product-name">${producto.nombre}</h3> <!-- Cambié 'h2' a 'h3' -->
                    <p class="product-description">${producto.descripcion}</p>
                    <strong class="product-price">$${producto.precio.toFixed(2)}</strong>
                    <span class="product-rating">${estrellasHTML}</span>
                    <a href="detalle.html?id=${producto.id}" class="add-cart">Ver Detalle</a> <!-- Cambié 'btn' a 'add-cart' -->
                </div>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });
}

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
