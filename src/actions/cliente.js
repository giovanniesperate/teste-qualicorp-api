const _ = require("lodash");

const { session } = require("../helpers/database");
const { v4: uuidv4 } = require("uuid");

const processaLista = async (records) => {
  let clientes = [];
  let propriedades = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    propriedades = {
      ...record._fields[0].properties,
      ...record._fields[1].properties,
      id: record._fields[0].identity.low,
    };
    clientes.push(propriedades);
  }

  const groupedClientList = _.groupBy(clientes, "id");

  const listaProcessada = _.map(groupedClientList, (cliente) => {
    let telefoneList = [];
    _.map(cliente, (prop) => {
      propriedades = { ...propriedades, ...prop };
      telefoneList.push({
        tipo: prop.tipo,
        num: prop.num,
      });
    });

    return {
      ...propriedades,
      telefoneList: _.orderBy(telefoneList, ["tipo"], ["asc"]),
    };
  });

  return listaProcessada;
};

module.exports = {
  async get() {
    const { records } = await session.run(
      `MATCH (p:Cliente)--(t)
       RETURN p, t`
    );
    return await processaLista(records);
  },
  async getById({ guid }) {
    const { records } = await session.run(
      `MATCH (p:Cliente { guid: $guid })--(t) 
       RETURN p, t`,
      {
        guid,
      }
    );
    return _.first(await processaLista(records));
  },
  async insert({ nome, email, cpf, telefoneList }) {
    await session.run(
      `CREATE (p:Cliente {guid: $guid, nome: $nome, email: $email, cpf: $cpf })
       WITH $telefoneList as lista, p
       UNWIND lista as row
       CREATE (p)<-[:CONTENHA]-(t:Telefone{ tipo: row.tipo, num: row.num})
       RETURN p, t`,
      {
        guid: uuidv4(),
        nome,
        email,
        cpf,
        telefoneList,
      }
    );
  },
  async update({ guid, nome, email, cpf, telefoneList }) {
    // Exclui relacionamentos
    await session.run(
      `MATCH (p:Cliente { guid: $guid })--(t) 
      DETACH DELETE t`,
      {
        guid,
      }
    );
    // Atualiza campos principais e recria relacionamentos
    await session.run(
      `MATCH (p:Cliente { guid: $guid })
      SET 
        p.nome = $nome, 
        p.email = $email,
        p.cpf = $cpf
      WITH $telefoneList as lista, p
      UNWIND lista as row
      CREATE (p)<-[:CONTENHA]-(t:Telefone{ tipo: row.tipo, num: row.num})
      RETURN p, t
      `,
      {
        guid,
        nome,
        email,
        cpf,
        telefoneList,
      }
    );
  },
  async delete({ guid }) {
    await session.run(
      `MATCH (p:Cliente { guid: $guid })--(t) 
      DETACH DELETE p, t`,
      {
        guid,
      }
    );
  },
};
