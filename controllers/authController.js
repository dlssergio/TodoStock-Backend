const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuarioEncontrado = await Usuario.findOne({ username });

        if (!usuarioEncontrado) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }

        const passwordValido = await bcrypt.compare(password, usuarioEncontrado.password);

        if (!passwordValido) {
            return res.render('login', { error: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { 
                id: usuarioEncontrado._id, 
                username: usuarioEncontrado.username,
                role: usuarioEncontrado.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.cookie('token', token, { httpOnly: true });
        
        if (usuarioEncontrado.role === 'admin') {
            res.redirect('/productos');
        } else {
            res.redirect('/pedidos');
        }
        
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error interno del servidor' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

module.exports = {
    login,
    logout
};