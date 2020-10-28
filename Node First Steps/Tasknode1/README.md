1.	Creamos la carpeta de proyecto AppMean y dentro otra llamada backend
2.	npm init
3.	creamos index.js
4.	npm i express
5.	npm i mongoose
6.	npm i jsonwebtokken
7.	creamos subcarpeta models y dentro creamos archivo auto.js
```
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//Esquema
const esquemaAuto = new mongoose.Schema({
  nombre: String,
  marca: String,
  modelo: String,
  precio: Number,
  color: String,
  fechaderegistro: {
    type: Date,
    default: Date.now,
  },
});
//
esquemaAuto.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      nombre: this.nombre,
      modelo: this.modelo,
    },
    "clave"
  );
};
//
const Auto = mongoose.model("auto", esquemaAuto);
module.exports.Auto = Auto;
module.exports.esquemaAuto = esquemaAuto;
```
8.	Creamos una carpeta afuera llamada routes
  Y dentro creamos un archivo llamada auto.js
```
//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Auto } = require("../models/auto");
//Ruta
router.post("/", async (req, res) => {
  //Revisamos si existe el mismo correo en la bd
  let auto = await Auto.findOne({ modelo: req.body.modelo });
  //si el auto existe en bd retornamos una respuesta de error 400
  if (auto) return res.status(400).send("El modelo de auto ya existe");
  //si no existe
  auto = new Auto({
    nombre: req.body.nombre,
    marca: req.body.marca,
    modelo: req.body.modelo,
    precio: req.body.precio,
    color: req.body.color,
  });
  //Guardamos el auto en BD y se genera el JWT
  const result = await auto.save();
  const jwtToken = auto.generateJWT();
  res.status(200).send({ jwtToken });
});
//Exports
module.exports = router;
```
Ahora vamos a editar el index.js que esta en la carpeta inicial
```
//Modulos Internos
const express = require("express");
const mongoose = require("mongoose");
//Modulos creados
const auto = require("./routes/auto");
//App
const app = express();
app.use(express.json());
app.use("/api/auto/", auto);

//Puerto de ejecucion
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port:  " + port));
//Registro en Mongo
mongoose
  .connect("mongodb://localhost/autosYa", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexion con mongo: OK"))
  .catch((error) => console.log("Conexion con mongo: OFF"));
```


Ahora corremos el servidor:
node index.js

 

Ahora abrimos postman teniendo mongod ya corriendo 
En postman escogemos nuevo y post vamos a body abajito escogemos raw, y a lo ultimo donde dice txt lo cambiamos por JSON
Y abajo copiamos lo siguiente
```
{
    "nombre": "323",
    "marca": "Mazda",
    "modelo": "Guapo 1950",
    "precio": 20000000,
    "color": "red"  
}
```
Luego le damos SEND.
Aquí ya debería crear la base de datos