const mongoose = require("mongoose");

const Cliente = mongoose.model('Cliente', {
    nome: String,
    email: String,
    cpf: String,
    telefone: String
});

module.exports = Cliente;