APPMEAN

1.	Creamos la carpeta de proyecto AppMean y dentro otra llamada backend
2.	npm init
3.	creamos index.js
4.	npm i express
5.	npm i mongoose
6.	npm i jsonwebtokken
7.	creamos subcarpeta models y dentro creamos archivo usuario.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
//Esquema
const esquemaUsuario = new mongoose.Schema({
  nombre: String,
  cedula: String,
  edad: Number,
  correo: String,
  pass: String,
  fechaderegistro: {
    type: Date,
    default: Date.now,
  },
});
//
esquemaUsuario.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      nombre: this.nombre,
      correo: this.correo,
    },
    "clave"
  );
};
//
const Usuario = mongoose.model("usuario", esquemaUsuario);
module.exports.Usuario = Usuario;
module.exports.esquemaUsuario = esquemaUsuario;
8.	creamos en la subcarpeta Models y dentro creamos archivo tablero.js
const mongoose = require("mongoose");
//Esquema
const esquemaTablero = new mongoose.Schema({
  idusuario: String,
  nombre: String,
  descripcion: String,
  sticker: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
});
//creamos los exports
const Tablero = mongoose.model("tablero", esquemaTablero);
module.exports.Tablero = Tablero;

9.	Creamos una carpeta afuera llamada routes
  Y dentro creamos un archivo llamada usuario.js
//Modulos internos
const express = require("express");
const router = express.Router();
//Modulos creados
const { Usuario } = require("../models/usuario");
//Ruta
router.post("/", async (req, res) => {
  //Revisamos si existe el mismo correo en la bd
  let usuario = await Usuario.findOne({ correo: req.body.correo });
  //si el usuario existe en bd retornamos una respuesta de error 400
  if (usuario) return res.status(400).send("El usuario ya existe");
  //si no existe
  usuario = new Usuario({
    nombre: req.body.nombre,
    cedula: req.body.cedula,
    edad: req.body.edad,
    correo: req.body.correo,
    pass: req.body.pass,
  });
  //Guardamos el usuario en BD y se genera el JWT
  const result = await usuario.save();
  const jwtToken = usuario.generateJWT();
  res.status(200).send({ jwtToken });
});
//Exports
module.exports = router;

Ahora vamos a editar el index.js que esta en la carpeta inicial



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



Ahora corremos el servidor:
node index.js

 

Ahora abrimos postman teniendo mongod ya corriendo 
En postman escogemos nuevo y post vamos a body abajito escogemos raw, y a lo ultimo donde dice txt lo cambiamos por JSON
Y abajo copiamos lo siguiente
{
    "nombre": "Pepe",
    "cedula": "123456",
    "edad": 20,
    "correo": "pepe@fsafas.com",
    "pass": "fsafasfasd"
}

Luego le damos SEND.
Aquí ya debería crear la base de datos 
