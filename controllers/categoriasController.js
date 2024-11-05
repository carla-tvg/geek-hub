const fs = require('fs');
const path = require('path');

// Ruta del archivo JSON de categorías
const filePath = path.join(__dirname, '../data/categorias.json');

// Obtener todas las categorías
exports.obtenerCategorias = (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de categorías' });
        }

        const categorias = JSON.parse(data);
        res.json(categorias);
    });
};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = (req, res) => {
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de categorías' });
        }

        const categorias = JSON.parse(data);
        const categoria = categorias.find(cat => cat.id == id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(categoria);
    });
};

// Crear una nueva categoría
exports.crearCategoria = (req, res) => {
    const { nombre, descripcion } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de categorías' });
        }

        const categorias = JSON.parse(data);
        const nuevaCategoria = {
            id: categorias.length > 0 ? categorias[categorias.length - 1].id + 1 : 1,
            nombre,
            descripcion
        };

        categorias.push(nuevaCategoria);

        fs.writeFile(filePath, JSON.stringify(categorias, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la categoría' });
            }
            res.json({ message: 'Categoría creada correctamente', categoria: nuevaCategoria });
        });
    });
};

// Editar una categoría existente
exports.editarCategoria = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de categorías' });
        }

        const categorias = JSON.parse(data);
        const categoriaIndex = categorias.findIndex(cat => cat.id == id);

        if (categoriaIndex === -1) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        categorias[categoriaIndex] = { id: Number(id), nombre, descripcion };

        fs.writeFile(filePath, JSON.stringify(categorias, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar la categoría' });
            }
            res.json({ message: 'Categoría actualizada correctamente' });
        });
    });
};

// Eliminar una categoría
exports.eliminarCategoria = (req, res) => {
    const { id } = req.params;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo de categorías' });
        }

        let categorias = JSON.parse(data);
        const categoriaIndex = categorias.findIndex(cat => cat.id == id);

        if (categoriaIndex === -1) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        categorias = categorias.filter(cat => cat.id != id);

        fs.writeFile(filePath, JSON.stringify(categorias, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al eliminar la categoría' });
            }
            res.json({ message: 'Categoría eliminada correctamente' });
        });
    });
};
