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
