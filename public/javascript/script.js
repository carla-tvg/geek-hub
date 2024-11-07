document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.navbar');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    } else {
        console.error("Elementos '.menu-toggle' o '.navbar' no encontrados.");
    }
});

  