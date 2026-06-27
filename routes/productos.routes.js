const express = require('express');
const router = express.Router();

const { getProductos, createProducto, getProductoById } = require('../controllers/productos.controller');
const { verificarRol } = require('../middlewares/authMiddleware');

router.get('/', verificarRol(['admin', 'deposito']), getProductos);
router.post('/', verificarRol(['admin', 'deposito']), createProducto);
router.get('/:id', verificarRol(['admin', 'deposito']), getProductoById);

module.exports = router;