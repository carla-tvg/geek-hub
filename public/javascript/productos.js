document.addEventListener("DOMContentLoaded", () => {
    // Cargar productos
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

    // Cargar carrito desde carrito.json
    cargarCarrito();
});

function mostrarProductos(productos) {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';

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
                    <a href="#" class="add-cart" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</a>
                </div>
            </div>
        `;
        productosContainer.innerHTML += productoHTML;
    });

    // Agregar evento a los botones de agregar al carrito
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', agregarAlCarrito);
    });
}

function agregarAlCarrito(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del enlace

    const producto = {
        id: event.target.dataset.id,
        nombre: event.target.dataset.nombre,
        precio: parseFloat(event.target.dataset.precio),
        cantidad: 1
    };

    // Enviar el producto al servidor para agregar al carrito
    fetch('/api/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al agregar el producto al carrito');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto agregado al carrito:', data);
        cargarCarrito(); // Actualiza el contador del carrito
    })
    .catch(error => {
        console.error('Hubo un problema con la petición Fetch:', error);
    });
}

function cargarCarrito() {
    fetch('/api/carrito')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el carrito');
            }
            return response.json();
        })
        .then(carrito => {
            const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
            const cartCount = document.getElementById('numero-carrito'); // Selecciona el contador del carrito
            cartCount.textContent = totalItems > 0 ? totalItems : ''; // Actualiza el texto del contador
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
}

// Función para crear las estrellas de puntuación
function crearEstrellas(puntuacion) {
    const estrellas = Math.round(puntuacion);
    let estrellasHTML = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= estrellas) {
            estrellasHTML += '<i class="fas fa-star"></i>'; // Estrella llena
        } else {
            estrellasHTML += '<i class="far fa-star"></i>'; // Estrella vacía
        }
    }
    return estrellasHTML;
}
