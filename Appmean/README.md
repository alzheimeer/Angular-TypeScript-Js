APPMEAN

1.	Creamos la carpeta de proyecto AppMean y dentro otra llamada backend
2.	npm init
3.	creamos index.js
4.	npm i express
5.	npm i mongoose
6.	npm i jsonwebtokken
7.	creamos subcarpeta models y dentro creamos archivo usuario.js
```
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
// podriamos exportarlo asi module.exports = Usuario; pero no usariamos las llaves
module.exports.Usuario = Usuario;
module.exports.esquemaUsuario = esquemaUsuario;

```
8.	creamos en la subcarpeta Models y dentro creamos archivo tablero.js
```
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

```
9.	Creamos una carpeta afuera llamada routes
  Y dentro creamos un archivo llamada usuario.js
  ```
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
```
Ahora vamos a editar el index.js que esta en la carpeta inicial


```
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

```

Ahora corremos el servidor:
node index.js

 

Ahora abrimos postman teniendo mongod ya corriendo 
En postman escogemos nuevo y post vamos a body abajito escogemos raw, y a lo ultimo donde dice txt lo cambiamos por JSON
Y abajo copiamos lo siguiente
```json
{
    "nombre": "Pepe",
    "cedula": "123456",
    "edad": 20,
    "correo": "pepe@fsafas.com",
    "pass": "fsafasfasd"
}
```

Luego le damos SEND.
Aquí ya debería crear la base de datos 

10.	Ahora en la carpeta routes creamos auth.js

```
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
```

Y en el index.js de afuera añadimos 
```
//traemos auth
const auth = require("./routes/auth");
app.use("/api/auth/", auth);
```

Aqui ya podemos crear usuarios y logearnos 



11.	Vamos a crear un middleware que identifique el token

En el backend creamos una subcarpeta llamada middleware y dentro auth.js

```
//modulos de node
const jwt = require("jsonwebtoken");
//creamos la funcion middleware
function auth(req, res, next) {
  //sacamos el Aithorization del header
  let jwtToken = req.header("Authorization");
  //separo el bearer del token
  /**
   * Beare.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjlhYmVmMjkxZDU5ODEwYjQwY2FhODQiLCJub21icmUiOiJDYXJsb3MiLCJjb3JyZW8iOiJwYXB0dWlAZnNhZmFzLmNvbSIsImlhdCI6MTYwMzk3Njk3OX0.ke8uXZJ_KYanVkuRkCBi6aznRrHhT-1vf69dPtn1KsY
   * Internamente reemplaza puntos por espacios
   * Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 eyJfaWQiOiI1ZjlhYmVmMjkxZDU5ODEwYjQwY2FhODQiLCJub21icmUiOiJDYXJsb3MiLCJjb3JyZW8iOiJwYXB0dWlAZnNhZmFzLmNvbSIsImlhdCI6MTYwMzk3Njk3OX0 ke8uXZJ_KYanVkuRkCBi6aznRrHhT-1vf69dPtn1KsY
   * Asi es como llega pero no necesitamos el Beare
   * Por eso le metemos un split para que separe con un espacio quedando
   * Beare eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 eyJfaWQiOiI1ZjlhYmVmMjkxZDU5ODEwYjQwY2FhODQiLCJub21icmUiOiJDYXJsb3MiLCJjb3JyZW8iOiJwYXB0dWlAZnNhZmFzLmNvbSIsImlhdCI6MTYwMzk3Njk3OX0 ke8uXZJ_KYanVkuRkCBi6aznRrHhT-1vf69dPtn1KsY
   *
   */
  jwtToken = jwtToken.split(" ")[1];
  //si no existe el token
  if (!jwtToken) return res.status(401).send("No hay token para validar");
  //Si existe
  try {
    //verificamos el token y verificamos si contiene la palabra clave.
    const payload = jwt.verify(jwtToken, "clave");
    //si verifica y todo ok, a ese usuario le agregamos los datos del payload
    req.usuario = payload;
    //y siguiente tarea, ya que cualquier cambio del usuario el middleware vuelve a verificar
    next();
  } catch (error) {
    res.status(401).send("Token no valido, sin autorizacion a procesos");
  }
}
//Exports
module.exports = auth;
```

12. Ahora vamos a la carpeta routes y creamos un archivo llamado tablero.js

```
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
    estado: req.body.estado,
  });
  //enviamos el resultado
  const result = await tablero.save();
  res.status(200).send(result);
});
//exports
module.exports = router;
```

13. Ahora vamos a index de afuera
```
//traemos tablero
const tablero = require("./routes/tablero");
//traemos tablero
app.use("/api/tablero/", tablero);
```
Aca ya podemos logearnos, y esto generara un token, si cogemos ese token lo copiamos 
y al crear una nueva tarea en el tablero y en el postman http://localhost:3000/api/tablero/
seleccionamos Authorization y BearToken y pegamos aqui este token y ebn el body colocamos 
```json
{
    "nombre": "crear home 3",
    "descripcion": "crear home en html y css3"
}
```

12.AHORA VAMOS A CONSULTAR LAS TAREAS QUE TENGA ESE USUARIO, APENAS SE LOGEE LE MUESTRE
Nos colocamos en tablero routes
```
//12. Obtener actividades de usuario
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
```
Al agregar esto ya vamos a postman y colocamos http://localhost:3000/api/tablero/lista en GET nos logeamos copiamos el token y en Athorization lo colocamos, y consultamos, debería traer todo las asignaciones de ese usuario.

```
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
```


En Postman http://localhost:3000/api/tablero/ con PUT
en el body enviamos lo que vamos a modificar y colocamos el token
```json
{
    "_id": "5f9c21d77017de4f0c51cb61",
    "nombre": "crear home 1",
    "descripcion": "crear home en html y css1",
    "estado": "terminada"
}
```

```
//14.ELIMINAR ACTIVIDAD en tablero 
router.delete("/:_id", auth, async (req, res) => {
  //Buscar el id del usuario logeado
  const usuario = await Usuario.findById(req.usuario._id);
  //si el usuario no existe
  if (!usuario) return res.status(401).send("El usuario no existe");
  //si existe
  //usamos delete, remove es mas complicado de usar
  const tablero = await Tablero.findByIdAndDelete(req.params._id);
  //si no existe actividad
  if (!tablero) return res.status(401).send("no hay actividad con ese id");
  //si se encuentra la actividad
  res.status(200).send({ message: "Actividad eliminada" });
});
```

En Postman le pondremos un DELETE y http://localhost:3000/api/tablero/5f97036a5a3a652ae0057c914
Donde el numero final seria el numero de id de la actividad a borrar y colocamos el token del usuario


