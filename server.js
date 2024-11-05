const express = require('express');
const session = require('express-session'); // Importa express-session
const app = express();
const path = require('path');
const routes = require('./routes/index'); // Asegúrate de que la ruta sea correcta

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para analizar cuerpos JSON
app.use(express.json()); // Agrega esta línea

// Configuración de express-session
app.use(session({
    secret: 'mi_secreto', // Cambia esto por un secreto más fuerte en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Usar las rutas definidas
app.use('/', routes);

// Puerto donde corre tu servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
