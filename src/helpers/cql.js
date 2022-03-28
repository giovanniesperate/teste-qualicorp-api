// Strings de Consulta

const getQuery = `MATCH (p:Cliente)<-[:CONTENHA]-(t:Telefone) 
                WITH t, p
                ORDER BY p.nome, t.tipo
                RETURN p{.*, telefoneList: collect(t{.*}) } as cliente`;

const getByIdQuery = `MATCH (p:Cliente { guid: $guid })<-[:CONTENHA]-(t:Telefone) 
                    WITH t, p
                    ORDER BY t.tipo
                    RETURN p{.*, telefoneList: collect(t{.*}) } as cliente`;

const insertQuery = `CREATE (p:Cliente {guid: $guid, nome: $nome, email: $email, cpf: $cpf })
                    WITH $telefoneList as lista, p
                    UNWIND lista as row
                    CREATE (p)<-[:CONTENHA]-(t:Telefone{ tipo: row.tipo, num: row.num})
                    RETURN p, t`;

const updateQuery1 = `MATCH (p:Cliente { guid: $guid })<-[v:CONTENHA]-(t:Telefone) 
                    DELETE v, t`;

const updateQuery2 = `MATCH (p:Cliente { guid: $guid })
                    SET 
                        p.nome = $nome, 
                        p.email = $email,
                        p.cpf = $cpf
                    WITH $telefoneList as lista, p
                    UNWIND lista as row
                    CREATE (p)<-[:CONTENHA]-(t:Telefone{ tipo: row.tipo, num: row.num})
                    RETURN p, t`;

const deleteQuery = `MATCH (p:Cliente { guid: $guid })<-[v:CONTENHA]-(t:Telefone) 
                    DELETE v, p, t`;

module.exports = {
  getQuery,
  getByIdQuery,
  insertQuery,
  updateQuery1,
  updateQuery2,
  deleteQuery,
};
