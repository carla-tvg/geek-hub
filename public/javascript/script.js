document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu');
    const dropdown = document.querySelector('.dropdown');

    menu.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el clic se propague al documento
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'; // Alterna la visibilidad
    });

    // Cierra el dropdown si se hace clic fuera de él
    document.addEventListener('click', () => {
        dropdown.style.display = 'block';
    });
});


const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

