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
