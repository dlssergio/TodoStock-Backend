const express = require('express');
const router = express.Router();

const { getPedidos, createPedido, getPedidoById } = require('../controllers/pedidos.controller');

router.get('/', getPedidos); 
router.post('/', createPedido); 
router.get('/:id', getPedidoById); 

module.exports = router;