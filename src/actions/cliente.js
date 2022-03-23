const { session } = require("../helpers/database");

module.exports = {
  async get() {
    const { records } = await session.run("MATCH (p:Cliente) RETURN p");

    let clientes = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const propriedades = {
        ...record._fields[0].properties,
        id: record._fields[0].identity.low,
      };
      clientes.push(propriedades);
    }

    return clientes;
  },
  async getById({ id }) {
    const { records } = await session.run(
      `MATCH (p:Cliente) WHERE id(p) = ${id} RETURN p`
    );
    return {
      ...records[0]._fields[0].properties,
      id: records[0]._fields[0].identity.low,
    };
  },
  async insert({ nome, email, cpf, telefone }) {
    await session.run(
      `CREATE (:Cliente {nome: '${nome}', email: '${email}', cpf: '${cpf}', telefone: '${telefone}'})`
    );
  },
  async update({ id, nome, email, cpf, telefone }) {
    await session.run(
      `
      MATCH (p:Cliente) WHERE id(p) = ${id}
        SET p.nome = '${nome}', 
        p.email = '${email}',
        p.cpf = '${cpf}',
        p.telefone = '${telefone}'
      `
    );
  },
  async delete({ id }) {
    await session.run(
      `MATCH (p:Cliente)
      WHERE id(p) = ${id}
      DELETE p`
    );
  },
};
