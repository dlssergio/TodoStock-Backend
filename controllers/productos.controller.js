const Producto = require('../models/Producto');

// Definimos un número como "Stock Mínimo" para disparar la alerta
const STOCK_MINIMO_CRITICO = 5;

// OBTENER TODOS LOS PRODUCTOS
const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('productos', { productos, usuario: req.user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno");
    }
};

// CREAR UN NUEVO PRODUCTO
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
            // Avisamos a otros usuarios conectados en tiempo real
            io.emit('nuevoProducto', {
                mensaje: `Nuevo producto registrado: "${nombre}" con un stock inicial de ${stockNumerico} u. (por ${usuarioAccion}).`,
                productoId: nuevoProducto._id
            });

            if (stockNumerico <= STOCK_MINIMO_CRITICO) {
                io.emit('alerta-stock', {
                    mensaje: `¡Alerta de Stock Crítico! El producto "${nombre}" fue creado con apenas ${stockNumerico} unidades por el usuario [${usuarioAccion}].`,
                    productoId: nuevoProducto._id,
                    stockActual: stockNumerico,
                    usuario: usuarioAccion
                });
            }
        }

        // Armamos el query param para avisarle al usuario que lo creó
        let queryExtra = '';
        if (stockNumerico <= STOCK_MINIMO_CRITICO) {
            queryExtra = `&alertaStock=${encodeURIComponent(nombre)}:${stockNumerico}`;
        }

        res.redirect(`/productos?creado=true${queryExtra}`);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(400).send("Error al guardar el producto. Verifique las validaciones.");
    }
};

// OBTENER UN PRODUCTO POR SU ID
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

// Formulario de nuevo producto
const renderNuevoProducto = async (req, res) => {
    try {
        res.render('nuevoProducto', { usuario: req.user });
    } catch (error) {
        console.error("Error al cargar formulario:", error);
        res.status(500).send("Error interno al cargar el formulario");
    }
};

// Cargar el formulario de edición con los datos del producto
const renderEditarProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) return res.status(404).send("Producto no encontrado");
        res.render('editarProducto', { producto, usuario: req.user });
    } catch (error) {
        console.error("Error al cargar edición:", error);
        res.status(500).send("Error interno al cargar el formulario");
    }
};

// Guardar los cambios editados en la base de datos
const updateProducto = async (req, res) => {
    try {
        const { nombre, precio, stock } = req.body;
        // Encuentra por ID y actualiza con los datos del formulario
        await Producto.findByIdAndUpdate(req.params.id, { nombre, precio, stock });
        res.redirect('/productos');
    } catch (error) {
        console.error("Error al actualizar:", error);
        res.status(400).send("Error al actualizar el producto");
    }
};

// Eliminar el producto de la base de datos
const deleteProducto = async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/productos');
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).send("Error al intentar eliminar el producto");
    }
};

module.exports = {getProductos, createProducto, getProductoById, renderNuevoProducto, renderEditarProducto, updateProducto, deleteProducto};