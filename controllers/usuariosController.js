// usuariosController.js
const fs = require('fs');
const path = require('path');

// Función para validar el formato de correo
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Función para obtener todos los usuarios
function obtenerUsuarios(req, res) {
    fs.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer los datos de usuarios');
        }
        let usuarios;
        try {
            usuarios = JSON.parse(data) || [];
        } catch (e) {
            return res.status(500).send('Error al parsear los datos de usuarios');
        }
        res.json(usuarios);
    });
}

// Función para registrar un nuevo usuario
function registrarUsuario(req, res) {
    const nuevoUsuario = req.body;

    if (!nuevoUsuario.nombreCompleto || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.password) {
        return res.status(400).send('Datos del usuario incompletos');
    }

    if (!validarCorreo(nuevoUsuario.correo)) {
        return res.status(400).send('Formato de correo inválido');
    }

    fs.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer los datos de usuarios');
        }
        let usuarios;
        try {
            usuarios = JSON.parse(data) || [];
        } catch (e) {
            return res.status(500).send('Error al parsear los datos de usuarios');
        }

        const usuarioExistente = usuarios.find(u => u.correo === nuevoUsuario.correo);
        if (usuarioExistente) {
            return res.status(400).send('El correo ya está registrado');
        }

        usuarios.push(nuevoUsuario);
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuarios, null, 2), err => {
            if (err) {
                return res.status(500).send('Error al guardar el nuevo usuario');
            }
            res.status(201).send('Usuario registrado exitosamente');
        });
    });
}

// Función para eliminar un usuario
function eliminarUsuario(req, res) {
    const { correo } = req.body;

    if (!correo) {
        return res.status(400).send('El correo es obligatorio para eliminar un usuario');
    }

    fs.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer los datos de usuarios');
        }
        let usuarios;
        try {
            usuarios = JSON.parse(data);
        } catch (e) {
            return res.status(500).send('Error al parsear los datos de usuarios');
        }

        const usuariosActualizados = usuarios.filter(u => u.correo !== correo);
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuariosActualizados, null, 2), err => {
            if (err) {
                return res.status(500).send('Error al actualizar los datos de usuarios');
            }
            res.send('Usuario eliminado exitosamente');
        });
    });
}

function obtenerUsuarioPorCorreo(req, res) {
    const { correo } = req.params; // Obtener el correo de los parámetros de la URL

    fs.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer los datos de usuarios');
        }
        let usuarios;
        try {
            usuarios = JSON.parse(data) || [];
        } catch (e) {
            return res.status(500).send('Error al parsear los datos de usuarios');
        }

        const usuario = usuarios.find(u => u.correo === correo); // Buscar el usuario por correo
        if (usuario) {
            res.json(usuario); // Enviar el usuario encontrado
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
}



module.exports = { obtenerUsuarios,
     registrarUsuario, 
     eliminarUsuario, 
     obtenerUsuarioPorCorreo 
    };

