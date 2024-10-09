const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Función para validar el formato de un correo electrónico
function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar correos
    return regex.test(correo); // Devuelve true si el formato es válido
}

// Ruta para obtener todos los usuarios
router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '../data/usuarios.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer los datos de usuarios');
        }
        
        let usuarios;
        try {
            usuarios = JSON.parse(data) || []; // Asegúrate de que usuarios sea un array
        } catch (e) {
            return res.status(500).send('Error al parsear los datos de usuarios');
        }

        res.json(usuarios);
    });
});

// Ruta para registrar un nuevo usuario
router.post('/', (req, res) => {
    const nuevoUsuario = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!nuevoUsuario.nombreCompleto || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.password) {
        return res.status(400).send('Datos del usuario incompletos');
    }

    // Validar el formato del correo
    if (!validarCorreo(nuevoUsuario.correo)) {
        return res.status(400).send('Formato de correo inválido');
    }

    // Leer el archivo de usuarios y continuar con el registro
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

        // Verificar si el correo ya está registrado
        const usuarioExistente = usuarios.find(u => u.correo === nuevoUsuario.correo);
        if (usuarioExistente) {
            return res.status(400).send('El correo ya está registrado');
        }

        // Agregar el nuevo usuario
        usuarios.push(nuevoUsuario);

        // Guardar los usuarios actualizados en el archivo
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuarios, null, 2), err => {
            if (err) {
                return res.status(500).send('Error al guardar el nuevo usuario');
            }
            res.status(201).send('Usuario registrado exitosamente');
        });
    });
});

// Ruta para eliminar un usuario
router.delete('/', (req, res) => {
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

        // Filtrar el usuario a eliminar
        const usuariosActualizados = usuarios.filter(u => u.correo !== correo);

        // Guardar los usuarios actualizados en el archivo
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuariosActualizados, null, 2), err => {
            if (err) {
                return res.status(500).send('Error al actualizar los datos de usuarios');
            }
            res.send('Usuario eliminado exitosamente');
        });
    });
});

module.exports = router;
