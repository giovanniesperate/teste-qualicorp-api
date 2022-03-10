const clienteModel = require("../models/Cliente");

module.exports = {
  async get() {
    return await clienteModel.find();
  },
  async getById({ id }) {
    return await clienteModel.findOne({ _id: id });
  },
  async insert({ nome, email, cpf, telefone }) {
    return await clienteModel.create({
      nome,
      email,
      cpf,
      telefone,
    });
  },
  async update({ id, nome, email, cpf, telefone }) {
    return await clienteModel.updateOne(
      {
        _id: id,
      },
      {
        nome,
        email,
        cpf,
        telefone,
      }
    );
  },
  async delete({ id }) {
    return clienteModel.deleteOne({ _id: id });
  },
};
