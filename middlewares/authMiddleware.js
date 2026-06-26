const jwt = require('jsonwebtoken');

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(403).render('login', { error: 'Acceso denegado. Por favor, inicie sesión.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!rolesPermitidos.includes(req.user.username)) {
                return res.status(403).render('login', { error: 'No tiene permisos para acceder a esta sección.' });
            }

            next();
        } catch (error) {
            return res.status(401).render('login', { error: 'Sesión expirada o inválida. Inicie sesión nuevamente.' });
        }
    };
};

module.exports = { verificarRol };