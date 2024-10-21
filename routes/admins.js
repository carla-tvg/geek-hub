// archivo: /routes/admins.js

const express = require('express');
const router = express.Router();
const admins = require('../data/admins.json'); // Asegúrate de tener un archivo JSON con las credenciales de los admins

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const admin = admins.find(admin => admin.email === email);

    if (admin) {
        if (admin.password === password) {
            // Devuelve el éxito y el rol del admin
            res.json({ success: true, role: admin.role }); // Asegúrate de que 'role' esté en tu JSON
        } else {
            res.json({ success: false, message: 'Contraseña incorrecta' });
        }
    } else {
        res.json({ success: false, message: 'Correo no encontrado' });
    }
});

module.exports = router;
