const fs = require('fs');
const path = require('path');

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

    const nuevoPedido = {
        id: pedidos.length + 1,
        cliente: req.body.cliente,
        productos: req.body.productos,
        total: req.body.total
    };

    pedidos.push(nuevoPedido);

    fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));

    res.json(nuevoPedido);
};

module.exports = {
    getPedidos,
    createPedido
};