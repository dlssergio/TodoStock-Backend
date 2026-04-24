const fs = require('fs');
const path = require('path');

// Ruta al archivo JSON
const filePath = path.join(__dirname, '../data/productos.json');

// Obtener todos los productos
const getProductos = (req, res) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(data);

    res.json(productos);
};

// Crear producto
const createProducto = (req, res) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(data);

    const nuevoProducto = {
        id: productos.length + 1,
        nombre: req.body.nombre,
        precio: req.body.precio,
        stock: req.body.stock
    };

    productos.push(nuevoProducto);

    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2));

    res.json(nuevoProducto);
};

// Obtener producto por ID
const getProductoById = (req, res) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(data);

    const id = parseInt(req.params.id);

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
};

module.exports = {
    getProductos,
    createProducto,
    getProductoById
};