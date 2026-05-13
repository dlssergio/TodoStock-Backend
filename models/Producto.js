const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true 
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: { 
        type: Number, 
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    categoria: { 
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);