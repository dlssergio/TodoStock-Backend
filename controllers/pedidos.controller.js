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
        // 'let' para poder modificar 'productos'
        let { cliente, productos, estado } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).send("Un pedido debe contener al menos un producto.");
        }

        if (typeof productos === 'string') {
            productos = [productos];
        }

        // productos siempre será un Array
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

                // Evaluamos si el stock quedó bajo
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

// Mostrar el formulario de nuevo pedido
const renderNuevoPedido = async (req, res) => {
    try {
        // Buscamos todos los productos disponibles para llenar las opciones del formulario
        const productos = await Producto.find();
        res.render('nuevoPedido', { productos, usuario: req.user });
    } catch (error) {
        console.error("Error al cargar formulario:", error);
        res.status(500).send("Error interno al cargar el formulario");
    }
};

// Cargar el formulario de edición
const renderEditarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).send("Pedido no encontrado");
        res.render('editarPedido', { pedido, usuario: req.user });
    } catch (error) {
        console.error("Error al cargar edición:", error);
        res.status(500).send("Error interno al cargar el formulario");
    }
};

// ACTUALIZAR PEDIDO Y GESTIONAR STOCK
const updatePedido = async (req, res) => {
    try {
        const { cliente, estado } = req.body;
        
        // Buscamos el pedido original 
        const pedidoOriginal = await Pedido.findById(req.params.id);
        if (!pedidoOriginal) return res.status(404).send("Pedido no encontrado");

        // Cancela por primera vez, devolvemos el stock
        if (pedidoOriginal.estado !== 'cancelado' && estado === 'cancelado') {
            for (const id of pedidoOriginal.productos) {
                // $inc es un comando nativo de MongoDB para incrementar un número
                await Producto.findByIdAndUpdate(id, { $inc: { stock: 1 } });
            }
        } 
        // Si estaba cancelado, stock devuelto y lo reactivan, volvemos a restar
        else if (pedidoOriginal.estado === 'cancelado' && estado !== 'cancelado') {
            for (const id of pedidoOriginal.productos) {
                await Producto.findByIdAndUpdate(id, { $inc: { stock: -1 } });
            }
        }

        // Nuevos datos del pedido
        pedidoOriginal.cliente = cliente;
        pedidoOriginal.estado = estado;
        await pedidoOriginal.save();

        res.redirect('/pedidos');
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(400).send("Error al actualizar el pedido");
    }
};

// ELIMINAR PEDIDO Y DEVOLVER STOCK
const deletePedido = async (req, res) => {
    try {
        // Pedido que se va a borrar
        const pedidoOriginal = await Pedido.findById(req.params.id);
        
        if (!pedidoOriginal) {
            return res.status(404).send("El pedido no existe");
        }

        // El stock si el pedido NO estaba cancelado
        if (pedidoOriginal.estado !== 'cancelado') {
            for (const id of pedidoOriginal.productos) {
                await Producto.findByIdAndUpdate(id, { $inc: { stock: 1 } });
            }
        }

        // Borramos el pedido de la base de datos
        await Pedido.findByIdAndDelete(req.params.id);
        
        res.redirect('/pedidos');
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).send("Error al intentar eliminar el pedido");
    }
};

module.exports = { getPedidos, createPedido, getPedidoById, renderNuevoPedido, renderEditarPedido, updatePedido, deletePedido };