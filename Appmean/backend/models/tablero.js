const mongoose = require("mongoose");
//Esquema
const esquemaTablero = new mongoose.Schema({
  idUsuario: String,
  nombre: String,
  descripcion: String,
  sticker: String,
  estado: String,
  fecha: {
    type: Date,
    default: Date.now,
  },
});
//creamos los exports
const Tablero = mongoose.model("tablero", esquemaTablero);
// podriamos exportarlo asi module.exports.Tablero = Tablero; pero cuando se llama se deben colocar llaves
// lo vamos enviar directo como una ruta
module.exports = Tablero;
