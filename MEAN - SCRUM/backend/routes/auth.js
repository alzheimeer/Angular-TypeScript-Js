//Modulos de node
const express = require("express");
const router = express.Router();
//Modulos internos
const { Usuario } = require("../models/usuario");
//ruta
router.post("/", async (req, res) => {
  //verificamos si existe el correo
  const usuario = await Usuario.findOne({ correo: req.body.correo });
  // Si no existe el correo
  if (!usuario)
    return res.status(400).send("Correo o contraseña no son validos");
  //si el pass no existe
  if (usuario.pass !== req.body.pass)
    return res.status(400).send("Correo o contraseña no son validos");
  //Generamos JWT
  const jwtToken = usuario.generateJWT();
  res.status(200).send({ jwtToken });
});
//exports
module.exports = router;
