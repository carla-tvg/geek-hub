
document.getElementById('recienLlegados').addEventListener('click', () => {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            const productosRecientes = filtrarRecienLlegados(data);
            mostrarProductos(productosRecientes);
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
        });
});


const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

