const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

const { neo4jDb } = require("../helpers/database");
const cql = require("../helpers/cql");

module.exports = {
  async get() {
    return await neo4jDb.customExecute(
      {
        cypher: cql.getQuery,
      },
      { accessMode: "READ" },
      [],
      "cliente"
    );
  },
  async getById({ guid }) {
    let [result] = await neo4jDb.execute(
      {
        cypher: cql.getByIdQuery,
        params: { guid },
      },
      { accessMode: "READ" }
    );
    return result && result.cliente;
  },
  async insert({ nome, email, cpf, telefoneList }) {
    await neo4jDb.execute({
      cypher: cql.insertQuery,
      params: { guid: uuidv4(), nome, email, cpf, telefoneList },
    });
  },
  async update({ guid, nome, email, cpf, telefoneList }) {
    // Exclui relacionamentos
    await neo4jDb.execute({
      cypher: cql.updateQuery1,
      params: { guid },
    });
    // Atualiza campos principais e recria relacionamentos
    await neo4jDb.execute({
      cypher: cql.updateQuery2,
      params: {
        guid,
        nome,
        email,
        cpf,
        telefoneList,
      },
    });
  },
  async delete({ guid }) {
    await neo4jDb.execute({
      cypher: cql.deleteQuery,
      params: { guid },
    });
  },
};
