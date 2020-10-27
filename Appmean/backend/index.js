//Modulos Internos
const express = require("express");
const mongoose = require("mongoose");
//Modulos creados
const usuario = require("./routes/usuario");
//App
const app = express();
app.use(express.json());
app.use("/api/usuario/", usuario);

//Puerto de ejecucion
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port:  " + port));
//Registro en Mongo
mongoose
  .connect("mongodb://localhost/scrum", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexion con mongo: OK"))
  .catch((error) => console.log("Conexion con mongo: OFF"));
