const fs = require('fs');
const path = require('path');
const Pedido = require('../models/Pedido');

// Ruta al archivo JSON
const filePath = path.join(__dirname, '../data/pedidos.json');

// Obtener todos los pedidos
const getPedidos = (req, res) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    res.json(pedidos);
};

// Generar un pedido
const createPedido = (req, res) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    const nuevoPedido = new Pedido(
        pedidos.length + 1,
        req.body.cliente,
        req.body.productos,
        req.body.total
    );

    pedidos.push(nuevoPedido);

    fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));

    res.json(nuevoPedido);
};

module.exports = {
    getPedidos,
    createPedido
};