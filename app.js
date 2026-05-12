require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');
const path = require('path');

conectarDB();

// Middleware para leer JSON
app.use(express.json());

// Configurar Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Importar rutas
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

// Usar rutas
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);

app.get('/', (req, res) => {
    res.send('TodoStock funcionando');
});

app.get('/vista-productos', (req, res) => {
    const filePath = path.join(__dirname, './data/productos.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const productos = JSON.parse(data);

    res.render('productos', { productos });
});

app.get('/vista-pedidos', (req, res) => {
    const filePath = path.join(__dirname, './data/pedidos.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const pedidos = JSON.parse(data);

    res.render('pedidos', { pedidos });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});