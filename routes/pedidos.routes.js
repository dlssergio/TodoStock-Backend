const express = require('express');
const router = express.Router();
const { getPedidos, createPedido, getPedidoById, renderNuevoPedido, renderEditarPedido, updatePedido, deletePedido } = require('../controllers/pedidos.controller');
const { verificarRol } = require('../middlewares/authMiddleware');

// RUTAS ESTÁTICAS 
router.get('/', verificarRol(['admin', 'deposito', 'ventas']), getPedidos);

// RUTAS DE CREACIÓN 
router.post('/', verificarRol(['admin', 'ventas']), createPedido);
router.get('/nuevo', verificarRol(['admin', 'ventas']), renderNuevoPedido);

// RUTAS DE EDICIÓN Y ELIMINACIÓN 
router.get('/editar/:id', verificarRol(['admin']), renderEditarPedido);
router.post('/editar/:id', verificarRol(['admin']), updatePedido);
router.post('/eliminar/:id', verificarRol(['admin']), deletePedido);

// RUTA AUXILIAR 
router.get('/:id', verificarRol(['admin', 'deposito', 'ventas']), getPedidoById);

module.exports = router;