document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();

    // Opcional: Refrescar los productos cada 60 segundos
    // setInterval(fetchProductos, 60000);
});

function fetchProductos() {
    fetch(`/api/productos?timestamp=${new Date().getTime()}`) // Esto es correcto
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
    productosContainer.innerHTML = ''; // Limpiar el contenedor

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'col-md-4 mb-4';
        productoDiv.innerHTML = `
            <div class="card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <p class="card-text">Stock: ${producto.stock}</p>
                </div>
            </div>
        `;
        productosContainer.appendChild(productoDiv);
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
