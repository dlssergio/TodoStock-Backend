const fs = require('fs');
const path = require('path');
const Producto = require('../models/Producto');

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

    const nuevoProducto = new Producto(
    productos.length + 1,
    req.body.nombre,
    req.body.precio,
    req.body.stock
    );

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