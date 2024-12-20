const fs = require('fs');
const path = require('path');

const login = (req, res) => {
    const { correoLogin, passwordLogin } = req.body;
    console.log('Solicitud de inicio de sesión recibida:', req.body);

    const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usuarios.json')));
    const usuario = usuarios.find(user => user.correo === correoLogin && user.password === passwordLogin);

    if (usuario) {
        req.session.usuario = usuario;
        // Devolver el ID del usuario junto con el mensaje de éxito
        res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user: { id: usuario.id } });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
};

module.exports = { login };
