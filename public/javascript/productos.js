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
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    productos.forEach(producto => {
<<<<<<< HEAD
        const estrellasHTML = crearEstrellas(producto.puntuacion);
        const productoHTML = `<div class="product-card"> <!-- Cambié 'product-card' a 'card' -->
=======
        const estrellasHTML = crearEstrellas(producto.puntuacion || 0); // Manejar puntuación undefined
        const productoHTML = `
            <div class="card">
>>>>>>> carlis/develop
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
        if (i <= puntuacion) {
            estrellas += '★'; // Estrella llena
        } else {
            estrellas += '☆'; // Estrella vacía
        }
    }
    return estrellas;
}
