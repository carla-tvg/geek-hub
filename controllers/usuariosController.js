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

    // Validaciones básicas de los campos
    if (!nuevoUsuario.nombreCompleto || !nuevoUsuario.telefono || !nuevoUsuario.correo || !nuevoUsuario.password) {
        return res.status(400).send('Datos del usuario incompletos');
    }

    // Validar el formato del correo
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

        // Verificar si el correo ya está registrado
        const usuarioExistente = usuarios.find(user => user.correo === nuevoUsuario.correo);
        if (usuarioExistente) {
            return res.status(400).send('El correo ya está registrado');
        }

        // Asignar un ID único al nuevo usuario usando Date.now()
        nuevoUsuario.id = Date.now();

        // Agregar el nuevo usuario al array
        usuarios.push(nuevoUsuario);

        // Guardar el array actualizado de usuarios en el archivo JSON
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuarios, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar los datos de usuarios');
            }

            res.status(201).send('Usuario registrado con éxito');
        });
    });
}

// Función para obtener un usuario por ID
function obtenerUsuarioPorId(req, res) {
    const userId = parseInt(req.params.id); // Obtener el ID del parámetro de la URL

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

        // Buscar el usuario por ID
        const usuario = usuarios.find(user => user.id === userId);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }

        res.json(usuario);
    });
}

// Función para eliminar un usuario por ID
function eliminarUsuario(req, res) {
    const userId = parseInt(req.params.id); // Obtener el ID del parámetro de la URL

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

        // Filtrar el array para eliminar el usuario con el ID dado
        const usuariosFiltrados = usuarios.filter(user => user.id !== userId);

        if (usuarios.length === usuariosFiltrados.length) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Guardar los usuarios restantes
        fs.writeFile(path.join(__dirname, '../data/usuarios.json'), JSON.stringify(usuariosFiltrados, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error al guardar los datos de usuarios');
            }

            res.send('Usuario eliminado con éxito');
        });
    });
}

module.exports = {
    obtenerUsuarios,
    registrarUsuario,
    obtenerUsuarioPorId,
    eliminarUsuario
};
