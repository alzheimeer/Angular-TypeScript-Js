//Modulos de Node
const express = require("express");
const router = express.Router();
//Modulos Internos
const Tablero = require("../models/tablero");
const { Usuario } = require("../models/usuario");
const auth = require("../middleware/auth");
//Rutas
//proceso post para registrar una actividad
//antes de hacer el async hacemos un auth si no valida muere hay.
router.post("/", auth, async (req, res) => {
  //traemos todos los datos de usuario y lo bscamos por su _id
  const usuario = await Usuario.findById(req.usuario._id);
  //si el usuario no existe
  if (!usuario) return res.status(401).send("El usuario no existe");
  //si existe creamos una actividad en el tablero
  const tablero = new Tablero({
    idUsuario: usuario._id,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  });
  //enviamos el resultado
  const result = await tablero.save();
  res.status(200).send(result);
});
//exports
module.exports = router;
