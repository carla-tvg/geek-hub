const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/index');

const app = express();

// Middleware para manejar CORS
app.use(cors({
    origin: 'http://localhost:3002'  // Cambia a la URL de tu frontend si es necesario
}));

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Configuración de express-session
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Usar las rutas definidas
app.use('/', routes);

app.use(cors({
    origin: 'http://localhost:3002', // La URL de tu frontend
    credentials: true // Permite el uso de cookies/sesión con la solicitud
}));

// Puerto donde corre tu servidor
const PORT = process.env.PORT || 3002; // Asegúrate de que el puerto sea el correcto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
