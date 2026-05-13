const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    cliente: { 
        type: String, 
        required: [true, 'El nombre del cliente es obligatorio'] 
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', // Referencia al modelo Producto
        required: true
    }],
    total: { 
        type: Number, 
        required: true,
        default: 0 
    },
    estado: { 
        type: String, 
        enum: ['pendiente', 'completado', 'cancelado'],
        default: 'pendiente'
    }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);