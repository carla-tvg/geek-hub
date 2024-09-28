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
            <div class="product-card">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                <h2 class="product-name">${producto.nombre}</h2>
                <p class="product-description">${producto.descripcion}</p>
                <span class="product-price">$${producto.precio.toFixed(2)}</span>
                <span class="product-rating">${estrellasHTML}</span>
                <a href="detalle.html?id=${producto.id}" class="btn">Ver Detalle</a>
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
