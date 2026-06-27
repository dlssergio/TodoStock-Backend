const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

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
        // Ya no extraemos el 'total' del req.body
        const { cliente, productos, estado } = req.body;

        if (!productos || productos.length === 0) {
            return res.status(400).send("Un pedido debe contener al menos un producto.");
        }

        // Buscamos en la base de datos los productos reales usando los IDs
        const productosDb = await Producto.find({ _id: { $in: productos } });

        // Calculamos el total automáticamente
        let totalCalculado = 0;
        console.log("--- INICIANDO CÁLCULO DE PEDIDO ---");

        productos.forEach(id => {
            const idLimpio = id.trim();
            const productoEncontrado = productosDb.find(p => p._id.toString() === idLimpio);
            
            if (productoEncontrado) {
                const precioReal = Number(productoEncontrado.precio);
                totalCalculado += precioReal;
                console.log(`✅ Sumando: ${productoEncontrado.nombre} -> $${precioReal}`);
            } else {
                console.log(`❌ ALERTA: No se encontró el ID: ${idLimpio}`);
            }
        });

        console.log("2. TOTAL FINAL CALCULADO: $", totalCalculado);
        console.log("-----------------------------------");

        // 4. Creamos el pedido inyectando el total calculado por nosotros
        const nuevoPedido = new Pedido({
            cliente,
            productos,
            total: totalCalculado,
            estado: estado || 'pendiente'
        });

        await nuevoPedido.save();
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
        res.render('detallePedido', { pedido });
    } catch (error) {
        console.error("Error al obtener pedido por ID:", error);
        res.status(500).send("Error al buscar el pedido solicitado.");
    }
};

module.exports = { getPedidos, createPedido, getPedidoById };