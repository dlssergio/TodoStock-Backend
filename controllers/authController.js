const login = (req, res) => {
    const { username, password } = req.body;

        if (username === 'admin' && password === '1234') {
        console.log("Login exitoso");
        res.redirect('/productos');
    } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
    }
};

const logout = (req, res) => {
    res.redirect('/login');
};

module.exports = {
    login,
    logout
};