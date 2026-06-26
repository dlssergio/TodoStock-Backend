const Producto = require('../models/Producto');

// 1. OBTENER TODOS LOS PRODUCTOS
const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        
        // DATOS MOCK: Simulamos que Julio ya hizo el login y nos pasó este usuario
        const usuarioFalso = { nombre: "Walter", rol: "admin" }; 

        // Le enviamos a Pug tanto los productos como el usuario
        res.render('productos', { productos, usuario: usuarioFalso });
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
        res.render('detalleProducto', { producto });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).send("Error al buscar el producto solicitado.");
    }
};

module.exports = { getProductos, createProducto, getProductoById };