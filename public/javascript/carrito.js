document.addEventListener("DOMContentLoaded", async () => {
    await mostrarCarrito(); // Mostrar el carrito al cargar la página
    actualizarCarritoIcono();
});

async function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    let total = 0;

    cartItemsContainer.innerHTML = '';

    for (let idProducto in carrito) {
        const cantidad = carrito[idProducto];
        const producto = await obtenerProductoPorId(idProducto);

        if (producto) {
            const tr = document.createElement('tr');
            const subtotal = producto.precio * cantidad;
            total += subtotal;

            // Crear las celdas de la fila
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toLocaleString('es-CO')}</td>
                <td>${cantidad}</td>
                <td>$${subtotal.toLocaleString('es-CO')}</td>
                <td>
                    <button class="button" onclick="agregarAlCarrito(${producto.id})">Agregar</button>
                    <button class="remove-button" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
                </td>
            `;
            
            cartItemsContainer.appendChild(tr);
        }
    }

    totalAmount.innerText = `$${total.toLocaleString('es-CO')}`;
}

function agregarAlCarrito(idProducto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    
    // Incrementar la cantidad del producto en el carrito
    if (carrito[idProducto]) {
        carrito[idProducto] += 1; // Aumentar cantidad si ya existe
    } else {
        carrito[idProducto] = 1; // Si no existe, añadir con cantidad 1
    }

    // Guardar el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Volver a mostrar el carrito
    mostrarCarrito();
}
function eliminarDelCarrito(idProducto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    
    // Verificar si el producto existe en el carrito
    if (carrito[idProducto]) {
        carrito[idProducto] -= 1; // Reducir la cantidad en uno
        
        // Si la cantidad llega a cero, eliminar el producto del carrito
        if (carrito[idProducto] <= 0) {
            delete carrito[idProducto];
        }
        
        // Guardar el carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Volver a mostrar el carrito
        mostrarCarrito();
    }
}
// Función para obtener un producto por ID (puedes modificar esto según tu implementación)
async function obtenerProductoPorId(id) {
    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        const productos = await response.json();
        return productos.find(prod => prod.id == id); // Buscar el producto por ID
    } catch (error) {
        console.error('Hubo un problema con la petición Fetch:', error);
        return null; // Retornar null en caso de error
    }
}
