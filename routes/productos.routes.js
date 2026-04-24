const express = require('express');
const router = express.Router();

const { getProductos, createProducto, getProductoById } = require('../controllers/productos.controller');

router.get('/', getProductos);
router.post('/', createProducto);
router.get('/:id', getProductoById);

module.exports = router;