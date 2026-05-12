const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        // process.env.MONGO_URI lee la cadena que pusimos en el archivo .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Conectado exitosamente a TodoStockDB');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1); // Detiene la aplicación si falla la base de datos
    }
};

module.exports = conectarDB;