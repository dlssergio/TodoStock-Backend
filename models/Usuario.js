const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ['admin', 'deposito', 'ventas'], 
        default: 'ventas'
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');