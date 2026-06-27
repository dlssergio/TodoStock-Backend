const Producto = require('../models/Producto');

// Definimos un número como "Stock Mínimo" para disparar la alerta
const STOCK_MINIMO_CRITICO = 5;

// 1. OBTENER TODOS LOS PRODUCTOS
const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('productos', { productos, usuario: req.user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno");
    }
};

// 2. CREAR UN NUEVO PRODUCTO
const createProducto = async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, stock });
        await nuevoProducto.save();

        // Capturamos quién hizo la acción
        const usuarioAccion = req.user ? req.user.username : 'Sistema';
        const stockNumerico = isNaN(Number(stock)) || stock === '' ? 0 : Number(stock);
        const io = req.app.get('io');

        if (io) {
            // Avisar a todos que se creó un producto (sin importar el stock)
            io.emit('nuevoProducto', {
                mensaje: `Nuevo producto registrado: "${nombre}" con un stock inicial de ${stockNumerico} u. (por ${usuarioAccion}).`,
                productoId: nuevoProducto._id
            });

            // Evaluamos si se creó con stock bajo
            if (stockNumerico <= STOCK_MINIMO_CRITICO) {
                io.emit('alerta-stock', {
                    mensaje: `¡Alerta de Stock Crítico! El producto "${nombre}" fue creado con apenas ${stockNumerico} unidades por el usuario [${usuarioAccion}].`,
                    productoId: nuevoProducto._id,
                    stockActual: stockNumerico,
                    usuario: usuarioAccion
                });
            }
        }

        res.redirect('/productos');
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(400).send("Error al guardar el producto. Verifique las validaciones.");
    }
};

// 3. OBTENER UN PRODUCTO POR SU ID
const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).render('error', { mensaje: 'Producto no encontrado' });
        }
        res.render('detalleProducto', { producto, usuario: req.user });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).send("Error al buscar el producto solicitado.");
    }
};

module.exports = { getProductos, createProducto, getProductoById };