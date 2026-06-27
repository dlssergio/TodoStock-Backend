const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Mismo umbral que en productos.controller.js
const STOCK_MINIMO_CRITICO = 5;

// OBTENER TODOS LOS PEDIDOS
const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate('productos');
        res.render('pedidos', { pedidos, usuario: req.user });
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).send("Error interno del servidor al cargar los pedidos.");
    }
};

// CREAR UN NUEVO PEDIDO
const createPedido = async (req, res) => {
    try {
        const { cliente, productos, estado } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).send("Un pedido debe contener al menos un producto.");
        }

        const productosDb = await Producto.find({ _id: { $in: productos } });
        const io = req.app.get('io');
        const usuarioAccion = req.user ? req.user.username : 'Sistema';

        let totalCalculado = 0;

        console.log("--- INICIANDO CÁLCULO DE PEDIDO ---");

        for (const id of productos) {
            const idLimpio = id.trim();
            const productoEncontrado = productosDb.find(p => p._id.toString() === idLimpio);

            if (productoEncontrado) {
                const precioReal = Number(productoEncontrado.precio);
                totalCalculado += precioReal;
                console.log(`✅ Sumando: ${productoEncontrado.nombre} -> $${precioReal}`);

                // Descontamos stock real al confirmar el pedido
                productoEncontrado.stock = Math.max(productoEncontrado.stock - 1, 0);
                await productoEncontrado.save();

                // Evaluamos si el stock quedó bajo con el dato real ya actualizado
                if (productoEncontrado.stock <= STOCK_MINIMO_CRITICO && io) {
                    io.emit('alerta-stock', {
                        mensaje: `Stock crítico: "${productoEncontrado.nombre}" quedó con ${productoEncontrado.stock} unidades tras el pedido de ${cliente}.`,
                        productoId: productoEncontrado._id,
                        stockActual: productoEncontrado.stock,
                        usuario: usuarioAccion
                    });
                }
            } else {
                console.log(`ALERTA: No se encontró el ID: ${idLimpio}`);
            }
        }

        console.log("2. TOTAL FINAL CALCULADO: $", totalCalculado);
        console.log("-----------------------------------");

        const nuevoPedido = new Pedido({
            cliente,
            productos,
            total: totalCalculado,
            estado: estado || 'pendiente'
        });

        await nuevoPedido.save();

        // Evento separado para avisar que hay un pedido nuevo (no es alerta de stock)
        if (io) {
            io.emit('nuevoPedido', {
                mensaje: `Nuevo pedido registrado para ${cliente} por $${totalCalculado}.`,
                pedidoId: nuevoPedido._id,
                cliente
            });
        }

        res.redirect('/pedidos');

    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(400).send("Error al guardar el pedido. Verifique las validaciones.");
    }
};

// OBTENER UN PEDIDO POR SU ID
const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id).populate('productos');
        if (!pedido) {
            return res.status(404).render('error', { mensaje: 'Pedido no encontrado' });
        }
        res.render('detallePedido', { pedido, usuario: req.user });
    } catch (error) {
        console.error("Error al obtener pedido por ID:", error);
        res.status(500).send("Error al buscar el pedido solicitado.");
    }
};

module.exports = { getPedidos, createPedido, getPedidoById };