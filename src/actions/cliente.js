const _ = require("lodash");

const { session } = require("../helpers/database");

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
    _.map(cliente, (prop) => {
      propriedades = { ...propriedades, ...prop };
      if (prop.comercial)
        propriedades = { ...propriedades, comercial: prop.comercial };
      if (prop.residencial)
        propriedades = { ...propriedades, residencial: prop.residencial };
      if (prop.celular)
        propriedades = { ...propriedades, celular: prop.celular };
    });
    return propriedades;
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
  async getById({ id }) {
    const { records } = await session.run(
      `MATCH (p:Cliente)--(t) 
       WHERE id(p) = $id 
       RETURN p, t`,
      {
        id: parseInt(id),
      }
    );
    return _.first(await processaLista(records));
  },
  async insert({ nome, email, cpf, telefoneList }) {
    await session.run(
      `CREATE (p:Cliente {nome: $nome, email: $email, cpf: $cpf }),
        (p)<-[:CONTENHA]-(:Celular {celular: $celular}),
        (p)<-[:CONTENHA]-(:Residencial {residencial: $residencial }),
        (p)<-[:CONTENHA]-(:Comercial {comercial: $comercial })
       RETURN p`,
      {
        nome,
        email,
        cpf,
        celular: telefoneList.celular,
        residencial: telefoneList.residencial,
        comercial: telefoneList.comercial,
      }
    );
  },
  async update({ id, nome, email, cpf, telefoneList }) {
    await session.run(
      `MATCH (p:Cliente),
        (p)<-[:CONTENHA]-(ce:Celular),
        (p)<-[:CONTENHA]-(r:Residencial),
        (p)<-[:CONTENHA]-(co:Comercial)
       WHERE id(p) = $id
       SET 
        p.nome = $nome, 
        p.email = $email,
        p.cpf = $cpf,
        ce.celular = $celular,
        r.residencial = $residencial,
        co.comercial = $comercial
      `,
      {
        id: parseInt(id),
        nome,
        email,
        cpf,
        celular: telefoneList.celular,
        residencial: telefoneList.residencial,
        comercial: telefoneList.comercial,
      }
    );
  },
  async delete({ id }) {
    await session.run(
      `MATCH (p:Cliente)--(t) 
      WHERE id(p) = $id
      DETACH DELETE p, t`,
      {
        id: parseInt(id),
      }
    );
  },
};
