const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para ver el formulario
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para procesar el formulario
router.post('/login', authController.login);

// Ruta para el logout
router.get('/logout', authController.logout);

module.exports = router;