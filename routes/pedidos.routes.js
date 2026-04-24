const express = require('express');
const router = express.Router();

const { getPedidos, createPedido } = require('../controllers/pedidos.controller');

// GET - POST /pedidos
router.get('/', getPedidos);
router.post('/', createPedido);

module.exports = router;