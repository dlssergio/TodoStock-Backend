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
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');