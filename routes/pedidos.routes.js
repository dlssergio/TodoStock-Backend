const express = require('express');
const router = express.Router();

const { getPedidos, createPedido, getPedidoById } = require('../controllers/pedidos.controller');
const { verificarRol } = require('../middlewares/authMiddleware');

router.get('/', verificarRol(['admin', 'deposito', 'ventas']), getPedidos);
router.post('/', verificarRol(['admin', 'deposito', 'ventas']), createPedido);
router.get('/:id', verificarRol(['admin', 'deposito', 'ventas']), getPedidoById);

module.exports = router;