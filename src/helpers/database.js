const { database } = require("@qualicorp_digital/utils");

const uri = "neo4j+s://e15e84bf.databases.neo4j.io";
const user = process.env.userNeo4J;
const password = process.env.passwordNeo4J;

module.exports.neo4jDb = database.neo4j.getQNeo4jCustom({
  url: uri,
  username: user,
  password: password,
});
