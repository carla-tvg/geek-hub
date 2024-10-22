document.getElementById('toggleTheme').addEventListener('click', function() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    if (themeStylesheet.getAttribute('href') === '../css/light-theme.css') {
        themeStylesheet.setAttribute('href', '../css/dark-theme.css');
        this.textContent = 'Cambiar a Modo Claro';
    } else {
        themeStylesheet.setAttribute('href', '../css/light-theme.css');
        this.textContent = 'Cambiar a Modo Oscuro';
    }
});
