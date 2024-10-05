// productos.js

document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();

    // Opcional: Refrescar los productos cada 60 segundos
    // setInterval(fetchProductos, 60000);
});

function fetchProductos() {
    fetch(`/api/productos?timestamp=${new Date().getTime()}`) // Evitar caché
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
}

function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar productos

    productos.forEach(producto => {
        const estrellasHTML = crearEstrellas(producto.puntuacion || 0); // Manejar puntuación undefined
        const productoHTML = `
            <div class="card mb-4" style="width: 18rem;">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text"><strong>${(producto.precio / 1000).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong></p>
                    <p class="card-text">Stock: ${producto.stock}</p>
                    <p class="card-text">Puntuación: ${estrellasHTML}</p>
                    <a href="detalle.html?id=${producto.id}" class="btn btn-primary">Ver Detalle</a>
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
