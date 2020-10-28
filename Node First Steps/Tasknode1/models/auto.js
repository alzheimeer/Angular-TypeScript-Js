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
