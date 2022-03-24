const { session } = require("../helpers/database");

module.exports = {
  async get() {
    const { records } = await session.run(
      "MATCH (p:Cliente)-[:POSSUI]->(t:Telefone) RETURN p, t"
    );

    let clientes = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const propriedades = {
        ...record._fields[0].properties,
        ...record._fields[1].properties,
        id: record._fields[0].identity.low,
      };
      clientes.push(propriedades);
    }

    return clientes;
  },
  async getById({ id }) {
    const { records } = await session.run(
      `MATCH (p:Cliente)-[:POSSUI]->(t:Telefone) WHERE id(p) = ${id} RETURN p, t`
    );
    return {
      ...records[0]._fields[0].properties,
      ...records[0]._fields[1].properties,
      id: records[0]._fields[0].identity.low,
    };
  },
  async insert({ nome, email, cpf, telefoneList }) {
    await session.run(
      `CREATE p = (:Cliente {nome: '${nome}', email: '${email}', cpf: '${cpf}'})-[:POSSUI]->(:Telefone {celular:'${telefoneList.celular}', residencial: '${telefoneList.residencial}', comercial: '${telefoneList.comercial}'})
      RETURN p`
    );
  },
  async update({ id, nome, email, cpf, telefoneList }) {
    await session.run(
      `
      MATCH (p:Cliente)-[:POSSUI]->(t:Telefone) 
      WHERE id(p) = ${id}
      SET p.nome = '${nome}', 
          p.email = '${email}',
          p.cpf = '${cpf}',
          t.celular = '${telefoneList.celular}',
          t.residencial = '${telefoneList.residencial}',
          t.comercial = '${telefoneList.comercial}'
      `
    );
  },
  async delete({ id }) {
    await session.run(
      `MATCH (p:Cliente)
      WHERE id(p) = ${id}
      DETACH DELETE p`
    );
  },
};
