require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Pug y archivos estáticos
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// Importar rutas 
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

// Usar rutas 
app.use('/productos', productosRoutes);
app.use('/pedidos', pedidosRoutes);

app.get('/', (req, res) => {
    res.send('TodoStock funcionando. Navega a /productos o /pedidos');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});