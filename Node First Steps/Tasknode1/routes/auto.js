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
