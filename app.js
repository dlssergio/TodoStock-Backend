require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const conectarDB = require('./config/db');
const http = require('http'); // Importación de HTTP
const { Server } = require('socket.io'); // Importación de Socket.io

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CONFIGURACIÓN DE SOCKET.IO
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io); // Guardamos 'io' en la app para poder usarlo desde los controladores

// 2. CONEXIÓN A BASE DE DATOS
conectarDB();

// 3. MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. CONFIGURACIÓN DE VISTAS (PUG)
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// 5. RUTAS
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

// 6. EVENTOS DE WEBSOCKETS
io.on('connection', (socket) => {
    console.log('¡Un usuario se conectó por WebSockets!');
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// 7. INICIO DEL SERVIDOR (Solo si no estamos en Vercel)
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`Servidor corriendo con Socket.io en http://localhost:${PORT}`);
    });
}

// 8. EXPORTACIÓN PARA VERCEL (Siempre al final)
module.exports = app;