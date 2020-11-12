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
