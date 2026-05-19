const Pedido = require('../models/Pedido');

// 1. OBTENER TODOS LOS PEDIDOS
const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('productos');
        res.render('pedidos', { pedidos });
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).send("Error interno del servidor al cargar los pedidos.");
    }
};

// 2. CREAR UN NUEVO PEDIDO
const createPedido = async (req, res) => {
    try {
        const { cliente, productos, total, estado } = req.body;
        const nuevoPedido = new Pedido({
            cliente,
            productos,
            total,
            estado: estado || 'pendiente'
        });
        await nuevoPedido.save();
        res.redirect('/pedidos');
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(400).send("Error al guardar el pedido. Verifique las validaciones.");
    }
};

// 3. OBTENER UN PEDIDO POR SU ID
const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('productos');
        if (!pedido) {
            return res.status(404).render('error', { mensaje: 'Pedido no encontrado' });
        }
        res.render('detallePedido', { pedido });
    } catch (error) {
        console.error("Error al obtener pedido por ID:", error);
        res.status(500).send("Error al buscar el pedido solicitado.");
    }
};

module.exports = { getPedidos, createPedido, getPedidoById };