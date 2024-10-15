document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items'); 
    const itemCount = document.getElementById('item-count');
    const totalPrice = document.getElementById('total-price');
    const emptyCartButton = document.getElementById('empty-cart');
    const checkoutButton = document.getElementById('checkout-button');

    let cartItems = [];

    // Cargar productos desde carrito.json
    fetch('carrito.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifica que los datos se carguen correctamente
            const products = data.products;
            displayProducts(products);
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    // Función para mostrar los productos en la página
    function displayProducts(products) {
        const productsContainer = document.querySelector('.productos');
        productsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('info-container');
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <strong>$${product.price.toFixed(2)}</strong>
                <button class="add-cart">Agregar al Carrito</button>
            `;
            productsContainer.appendChild(productDiv);

            // Agregar evento a los botones de agregar al carrito
            productDiv.querySelector('.add-cart').addEventListener('click', function(event) {
                event.preventDefault(); // Evitar el comportamiento por defecto del enlace
                
                addToCart(product);
            });
        });
    }

    // Función para agregar el producto al carrito
    function addToCart(product) {
        const existingItem = cartItems.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1; // Aumentar la cantidad si ya existe
        } else {
            cartItems.push({ name: product.name, price: product.price, quantity: 1 });
        }
        updateCart();
    }

    // Función para actualizar el carrito
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Limpiar el contenedor
        let total = 0;

        cartItems.forEach((item, index) => {
            total += item.price * item.quantity; // Calcular el total

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                ${item.name} - $${item.price.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                x ${item.quantity} 
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        itemCount.textContent = cartItems.length;
        totalPrice.textContent = `$${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Agregar evento para eliminar artículo
        addRemoveItemEvent();
    }

    // Función para agregar eventos a los botones de eliminar
    function addRemoveItemEvent() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                cartItems.splice(index, 1); // Eliminar el artículo
                updateCart();
            });
        });
    }

    // Vaciar carrito
    emptyCartButton.addEventListener('click', () => {
        cartItems = [];
        updateCart();
    });

    // Funcionalidad para finalizar la compra
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('El carrito está vacío. No puedes finalizar la compra.');
            return;
        }

        alert('Compra finalizada. ¡Gracias por tu compra!');
        emptyCartButton.click(); // Vaciar el carrito después de la compra
    });
});
