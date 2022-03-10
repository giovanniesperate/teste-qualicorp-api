require("dotenv").config();

const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Rotas

const index = require("./routes/index");
const clienteRoute = require("./routes/cliente");

app.use("/", index);
app.use("/cliente", clienteRoute);

module.exports = app;
