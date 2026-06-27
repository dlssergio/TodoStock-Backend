require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

//CONFIGURACIÓN DE SOCKET.IO:
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server); //

// Conexiones de los clientes (para pruebas en consola)
io.on('connection', (socket) => {
    console.log('¡Un usuario se conectó por WebSockets!');
    
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

app.set('io', io);

server.listen(PORT, () => {
    console.log(`Servidor corriendo con Socket.io en http://localhost:${PORT}`);
});