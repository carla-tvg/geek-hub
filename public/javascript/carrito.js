document.addEventListener("DOMContentLoaded", async () => {
    await mostrarCarrito(); // Mostrar el carrito al cargar la página
    actualizarCarritoIcono(); // Actualizar el número de productos en el ícono del carrito
});


async function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    let total = 0;

    cartItemsContainer.innerHTML = ''; // Limpiar el contenedor de los productos

    for (let idProducto in carrito) {
        const cantidad = parseInt(carrito[idProducto], 10); // Asegurar que sea un número
        const producto = await obtenerProductoPorId(idProducto);

        if (producto) {
            const tr = document.createElement('tr');
            const subtotal = producto.precio * cantidad;
            total += subtotal;

            tr.innerHTML = `
                <td><img src="${producto.imagen}" alt="${producto.nombre}" class="cart-product-image" style="width: 50px; height: auto;"></td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toLocaleString('es-CO')}</td>
                <td>
                    <button class="button" onclick="cambiarCantidad('${producto.id}', -1)">-</button>
                    <span>${cantidad}</span>
                    <button class="button" onclick="cambiarCantidad('${producto.id}', 1)">+</button>
                </td>
                <td>$${subtotal.toLocaleString('es-CO')}</td>
                <td>
                    <button class="remove-button" onclick="eliminarDelCarrito('${producto.id}')">Eliminar</button>
                </td>
            `;
            
            cartItemsContainer.appendChild(tr);
        }
    }

    totalAmount.innerText = `$${total.toLocaleString('es-CO')}`;
    actualizarCarritoIcono(); // Actualizar el ícono del carrito
}

function cambiarCantidad(idProducto, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};

    // Verificar si el producto existe en el carrito
    if (carrito[idProducto] != null) {
        carrito[idProducto] = (parseInt(carrito[idProducto], 10) || 0) + cambio; // Cambiar la cantidad

        // Si la cantidad llega a cero o menos, eliminar el producto del carrito
        if (carrito[idProducto] <= 0) {
            delete carrito[idProducto];
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Volver a mostrar el carrito
        mostrarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    
    // Verificar si el producto existe en el carrito
    if (carrito[idProducto]) {
        delete carrito[idProducto]; // Eliminar el producto del carrito
        
        // Guardar el carrito actualizado
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Volver a mostrar el carrito
        mostrarCarrito();
        actualizarCarritoIcono(); // Actualizar el número en el ícono del carrito
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
    mostrarCarrito(); // Volver a mostrar el carrito
    actualizarCarritoIcono(); // Actualizar el número en el ícono del carrito
}

// Función para finalizar la compra
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    
    if (Object.keys(carrito).length === 0) {
        alert('El carrito está vacío. Añade productos antes de finalizar la compra.');
        return;
    }

    // Aquí puedes agregar la lógica para procesar el pago o enviar la orden
    alert('Compra finalizada con éxito. ¡Gracias por tu compra!');

    // Vaciar el carrito después de la compra
    vaciarCarrito();
}

function actualizarCarritoIcono() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || {};
    const carritoNumero = document.getElementById('carrito-numero');
    const totalItems = Object.values(carrito).reduce((total, cantidad) => total + parseInt(cantidad, 10), 0);
    carritoNumero.innerText = totalItems; // Mostrar el total de productos en el ícono
}

// Función para obtener un producto por ID
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
