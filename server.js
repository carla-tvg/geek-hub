const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
});

// Ruta para obtener los productos desde db.json
app.get('/api/productos', (req, res) => {
    const fs = require('fs');
    fs.readFile('db.json', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer la base de datos');
        }
        res.json(JSON.parse(data));
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
