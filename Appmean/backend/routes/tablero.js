//Modulos de Node
const express = require("express");
const router = express.Router();
//Modulos Internos
const Tablero = require("../models/tablero");
const { Usuario } = require("../models/usuario");
const auth = require("../middleware/auth");
//Rutas

//12. CONSULTAR Obtener actividades de usuario
router.get("/lista", auth, async (req, res) => {
  //Buscar el id del usuario logeado
  const usuario = await Usuario.findById(req.usuario._id);
  //si el usuario no existe
  if (!usuario) return res.status(401).send("El usuario no existe");
  //si existe creamos una actividad en el tablero
  //traigame todas las tareas de un usuario usando find()
  const tablero = await Tablero.find({ idUsuario: req.usuario._id });
  res.send(tablero);
});

//13. EDITAR ACTIVIDAD
router.put("/", auth, async (req, res) => {
  //Buscar el id del usuario logeado
  const usuario = await Usuario.findById(req.usuario._id);
  //si el usuario no existe
  if (!usuario) return res.status(401).send("El usuario no existe");
  //si existe
  //Realizamos el Update
  const tablero = await Tablero.findByIdAndUpdate(
    req.body._id,
    {
      idUsuario: usuario._id,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      estado: req.body.estado,
    },
    {
      new: true,
    }
  );
  //si no hay actividad para el usuario
  if (!tablero) return res.status(401).send("no hay actividad asignada");
  //si se realizo un update a alguna actividad
  res.status(200).send(tablero);
});

//14.ELIMINAR ACTIVIDAD
router.delete("/:_id", auth, async (req, res) => {
  //Buscar el id del usuario logeado
  const usuario = await Usuario.findById(req.usuario._id);
  //si el usuario no existe
  if (!usuario) return res.status(401).send("El usuario no existe");
  //si existe
  //usamos delete., remove es mas complicado de usar
  const tablero = await Tablero.findByIdAndDelete(req.params._id);
  //si no existe actividad
  if (!tablero) return res.status(401).send("no hay actividad con ese id");
  //si se encuentra la actividad
  res.status(200).send({ message: "Actividad eliminada" });
});

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
    estado: req.body.estado,
  });

  //enviamos el resultado
  const result = await tablero.save();
  res.status(200).send(result);
});
//exports
module.exports = router;
