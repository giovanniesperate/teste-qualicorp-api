const neo4j = require("neo4j-driver");

const uri = "neo4j+s://e15e84bf.databases.neo4j.io";
const user = process.env.userNeo4J;
const password = process.env.passwordNeo4J;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

module.exports = { session };
