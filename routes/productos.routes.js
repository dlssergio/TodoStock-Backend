const express = require('express');
const router = express.Router();
const { getProductos, createProducto, getProductoById, renderNuevoProducto, renderEditarProducto, updateProducto, deleteProducto } = require('../controllers/productos.controller');
const { verificarRol } = require('../middlewares/authMiddleware');

// RUTAS ESTÁTICAS GENERALES
router.get('/', verificarRol(['admin', 'deposito']), getProductos);

// RUTAS DE CREACIÓN PARA ADMIN
router.post('/', verificarRol(['admin']), createProducto);
router.get('/nuevo', verificarRol(['admin']), renderNuevoProducto);

// RUTAS DE EDICIÓN Y ELIMINACIÓN PARA ADMIN
router.get('/editar/:id', verificarRol(['admin']), renderEditarProducto);
router.post('/editar/:id', verificarRol(['admin']), updateProducto);
router.post('/eliminar/:id', verificarRol(['admin']), deleteProducto);

// RUTA COMODÍN 
router.get('/:id', verificarRol(['admin', 'deposito']), getProductoById);

module.exports = router;