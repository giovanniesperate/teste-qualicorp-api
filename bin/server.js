const app = require("../src/app");
const mongoose = require("mongoose");

const user = process.env.user;
const password = process.env.password;

mongoose
  .connect(
    `mongodb+srv://${user}:${password}@cluster0.ezcmm.mongodb.net/db?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectado");
    app.listen(process.env.PORT || 3001);
  })
  .catch((err) => console.log(err));
