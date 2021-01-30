![](MEAN-1.png)
![](MEAN-2.png)
![](MEAN-3.png)
![](MEAN-4.png)
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


MANEJO DE ARCHIVOS
 Imágenes documentos etc

15. dentro de la carpeta middleware creamos el archivo file.js y dentro la carpeta backend creamos una carpeta llamada public.
Instalamos una librería que funciona como middleware pero para el sistema de archivos

npm install multer              

y ahora editamos el archivo
```
//modulos de node
const multer = require("multer");
//directorio donde se van a guardar los archivos que subamos
const directorio = "./public/";
// DiskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //si llega todo null se va a un error interno del multer
    cb(null, directorio);
  },
  filename: (req, file, cb) => {
    // por medio de la fecha de subida el asigna un codigo unico a cada archivo
   const filename = Date.now() + "-" + file.originalname.toLowerCase().split(" ").join("-");
   cb(null, filename);
  },
});

//Cargar archivo
const cargarArchivo = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    //formatos/extensiones aceptados
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Solo aceptamos este tipo de archivos jpg gif o png")
      );
    }
  },
});
//Exports
module.exports = cargarArchivo;
```





Y en Routes/tablero.js metemos 
```
//Arriba importamos 
const cargararchivo = require("../middleware/file");


//15. Registrar una actividad con Imagen
router.post(
  "/cargararchivo",
  cargarArchivo.single("sticker"),
  auth,
  async (req, res) => {
    //protocolo http o https p con el local o el dominio
    const url = req.protocol + "://" + req.get("host");
    //verificamos si existe el usuario
    const usuario = await Usuario.findById(req.usuario._id);
    //si el usuario no existe
    if (!usuario) return res.status(401).send("El usuario no existe");
    //definimos la ruta de la imagen
    let rutaImagen = null;
    if (req.file.filename) {
      rutaImagen = url + "/public/" + req.file.filename;
      //http://localhost:3000/public/22135451-sticker.jpg
    } else {
      rutaImagen = null;
    }
    //guardar en tablero
    const tablero = new Tablero({
      idUsuario: usuario._id,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      sticker: rutaImagen,
      estado: req.body.estado,
    });
    const result = await tablero.save();
    res.status(200).send(result);
  }
);
```

Instalamos CORS

npm i cors


con este compartimos recursos

vamos a index.js en el root 
```
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//Modulos creados
const usuario = require("./routes/usuario");
const auth = require("./routes/auth");
const tablero = require("./routes/tablero");
//App
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/usuario/", usuario);
app.use("/api/auth/", auth);
app.use("/api/tablero/", tablero);

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


FRONT

Ahora nos ubicamos en la carpeta Appmean
Y abrimos el terminal y creamos un proyecto de angular y le decimos que cree el roooting 

ng new frontend --routing


Vamos al a la carpeta frontend
Probamos el servidor con     ng serve

Y debería estar corriendo en http://localhost:4200/

Ahora tumbamos el server 
Y generamos los componentes

ng g c menú
ng g c login
ng g c registro

y tablero es ca a hacer una carpeta con 2 componentes por dentro 

ng g c tablero/crear
ng g c tablero/listar 

 

Abrimos app-routing.module.ts

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListarComponent } from './tablero/listar/listar.component';
import { CrearComponent } from './tablero/crear/crear.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'listarActividades',
    component: ListarComponent,
  },
  {
    path: 'crearActividad',
    component: CrearComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```


En app.component.html 
Borramos todo y solo dejamos 
```
<app-menu></app-menu>
<router-outlet></router-outlet>
```
Con el app-menu hay nos aseguramos que el menu aparezca en todas las paginas

Colocamos el ng serve y miramos todas las rutas

Instalamos Material
ng add @angular/material
aquí coloca un import en app.module.ts
```
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
imports:
    BrowserAnimationsModule,
```





Vamos a la page de material 
https://material.angular.io/components/toolbar/api
https://material.angular.io/components/button/api
https://material.angular.io/components/icon/api


Vamos a toolbars, buttons y icon y copiamos la api

Y copiamos los imports al modulo principal app.module.ts

```
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
```

y abajo en imports debería quedar asi
```
imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
```
Ahora vamos a la carpeta menú y entramos al menu.component.html

Y colocamos
``` 
<mat-toolbar color="primary">
    <ul>
        <a routerLink="crearActividad"> Crear Actividad</a>
    </ul>
    <ul>
        <a routerLink="listarActividades">Lista de actividades</a>
    </ul>

    <ul>
        <a routerLink="login">Login</a>
    </ul>

    <ul>
        <a routerLink="registro">Registro</a>
    </ul>
</mat-toolbar>
```
Ahora corremos el servidor 

1-Front

Bajamos el servidor y nos vamos al menú.component.css

En la carpeta frontend en el terminal instalamos 

npm install -s @angular/flex-layout @angular/cdk


menu.component.css

```
.spacer {
    flex: 1 1 auto;
}

.spacerIcon {
    flex: 0.1 0.1 auto;
}

a {
    text-decoration: none;
    color: white;
}

.menu {
    background-color: rgb(110, 110, 110);
}
```
menu.component.html
```
<mat-toolbar class="menu">
    <mat-icon aria-hidden="false" aria-label="event">event</mat-icon>
    <ul>
        <a routerLink="crearActividad"> Crear actividad </a>
    </ul>
    <span class="spacerIcon"></span>
    <mat-icon aria-hidden="false" aria-label="fact_check">fact_check</mat-icon>
    <ul>
        <a routerLink="listarActividades"> Lista de actividades </a>
    </ul>

    <span class="spacer"></span>
    <ul>
        <mat-icon aria-hidden="false" aria-label="account_box">account_box</mat-icon>
        <a routerLink="login"> Login</a>
    </ul>
    <ul>
        <mat-icon aria-hidden="false" aria-label="account_circle">account_circle</mat-icon>
        <a routerLink="registro"> Registro</a>
    </ul>
</mat-toolbar>
```

app.module.ts

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { CrearComponent } from './tablero/crear/crear.component';
import { ListarComponent } from './tablero/listar/listar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    RegistroComponent,
    CrearComponent,
    ListarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```



2. CREAMOS UN SERVICIO

Bajamos el servidor 

ng g s service/auth

En app.module.ts agregamos estos import y provider

```
import { AuthService } from './service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { from } from 'rxjs';

  imports: 
    HttpClientModule,
  providers: [AuthService],
```

Ahora vamos al servicio auth.service.ts
Y creamos la parte de registrar usuario y luego login

```
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registroUrl = 'http://localhost:3000/api/usuario/';
  private loginUrl = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) { }
  // Creamos un obserbable
  // usuario seria un json
  registroUsuario(usuario) {
    return this.http.post<any>(this.registroUrl, usuario)
  }
  loginUsuario(usuario){
    return this.http.post<any>(this.loginUrl, usuario)
  }
}
```

Ahora vamos a registroComponent.ts


Importamos 
```
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  // Datos obtenidos desde el Html
  registroUsuario = {
    nombre: '',
    cedula: '',
    edad: '',
    correo: '',
    pass: '',
  };
  ngOnInit(): void {}
  registrar() {
    this.auth.registroUsuario(this.registroUsuario).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log(err)
    );
  }
}
```

Pasamos al CSS del registro
```
.container {
    display: flex;
    flex-direction: column;
}

.button {
    width: 100%;
}

.card {
    min-width: 150px;
    max-width: 500px;
    width: 100%;
}

.form {
    display: flex;
    justify-content: center;
    align-items: center;
}

mat-card-title {
    text-align: center;
}

.col {
    background-color: rgb(110, 110, 110);
}
```

Y ahora el html

```
<div class="form">
    <mat-card-title>Registrar Usuario</mat-card-title>
    <mat-card-content>
        <div class="container">
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.nombre" matInput placeholder="Nombre" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.cedula" matInput placeholder="Cedula" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.edad" matInput placeholder="Edad" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.correo" matInput placeholder="Correo" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.pass" matInput placeholder="Contraeña" />
            </mat-form-field>
        </div>
    </mat-card-content>
    <mat-card-actions>
        <button (click)="registrar()" class="button col" mat-raised-button>
      Registrar
    </button>
    </mat-card-actions>
</div>
```

Ahora login.component.ts
```
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  loguear = {
    correo: '';
    pass: ''
  }
  ngOnInit(): void {

  }
  login() {
    this.auth.loginUsuario(this.loguear).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => console.log(err)
    );
  }
}
```

Ahora login,component.html

```
<div class="form">
    <mat-card-title>Registrar Usuario</mat-card-title>
    <mat-card-content>
        <div class="container">
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.nombre" matInput placeholder="Nombre" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.cedula" matInput placeholder="Cedula" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.edad" matInput placeholder="Edad" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.correo" matInput placeholder="Correo" />
            </mat-form-field>
            <mat-form-field>
                <input [(ngModel)]="registroUsuario.pass" matInput placeholder="Contraeña" />
            </mat-form-field>
        </div>
    </mat-card-content>
    <mat-card-actions>
        <button (click)="registrar()"  class="button col" mat-raised-button>
      Registrar
    </button>
    </mat-card-actions>
</div>
```

Ahora en una terminal Appmean\backend>node index.js
Y lo dejamos ejecutandose


ULTIMAS DOS CLASES

En login.component.ts agregamos 
```
localStorage.setItem('token', res.jwtToken)
```
para guardar el token en el localstorage, con el key: token y value: “El token”


Ahora abrimos tablero/crear/y css y copiamos todo el style de otro, y lo mismo con html

```
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) {}

  crearActividad = {
    nombre: '',
    estado: '',
    descripcion: ''
  }
  ngOnInit(): void {
  }

  crear(){}
}
```

```
<div class="form">
  <mat-card class="card">
    <mat-card-title>Crear Actividad</mat-card-title>
    <mat-card-content>
      <div class="container">
        <mat-form-field>
          <input
            [(ngModel)]="crearActividad.nombre"
            matInput
            placeholder="Nombre"
          />
        </mat-form-field>
        <mat-form-field>
          <input
            [(ngModel)]="crearActividad.estado"
            matInput
            placeholder="Estado"
          />
        </mat-form-field>
        <mat-form-field>
          <input
            [(ngModel)]="crearActividad.descripcion"
            matInput
            placeholder="Descripcion"
          />
        </mat-form-field>
      </div>
    </mat-card-content>
    <mat-card-actions>
      <button (click)="crear()" class="button col" mat-raised-button>
        Crear
      </button>
    </mat-card-actions>
  </mat-card>
</div>
```

```
.container {
    display: flex;
    flex-direction: column;
}

.button {
    width: 100%;
}

.card {
    min-width: 150px;
    max-width: 500px;
    width: 100%;
}

.form {
    display: flex;
    justify-content: center;
    align-items: center;
}

mat-card-title {
    text-align: center;
}

.col {
    background-color: rgb(110, 110, 110);
}
```

Hay ya aparece los formularios bien 

Y si la persona se loguea correctamente, debe ir a la lista de actividades.

Vamos al login.component.ts
Y debajo de el sabe del localstorage, que luego del logeo redireccione 

```
this.router.navigate(['/listarActividad'])
```

y hacemos lo mismo con el registro.ts, para que redireccione a login luego de registrarse.

```
this.router.navigate(['/login'])
```

si no esta logeado no se pueda navegar

ng g guard guard/auth

Al instalar esto se crea una carpeta guard

Primero vamos al auth.service.ts

CON DOS !! devuelve booleano TRUE o FALSE

```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registroUrl = 'http://localhost:3000/api/usuario/';
  private loginUrl = 'http://localhost:3000/api/auth';

  constructor( private http: HttpClient) { }

  registroUsuario(usuario){
    return this.http.post<any>(this.registroUrl, usuario);
  }
  loginUsuario(usuario){
    return this.http.post<any>(this.loginUrl, usuario);
  }

  loginOn() {
    return !!localStorage.getItem('token');
  }

  obtenerToken(){
    return localStorage.getItem('token');
  }
}
```

App-routing-modules

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListarComponent } from './tablero/listar/listar.component';
import { CrearComponent } from './tablero/crear/crear.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from './guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'listarActividades',
    component: ListarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'crearActividad',
    component: CrearComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```



auth.guard.ts

```
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private auth: AuthService, private router: Router) { }
  
  canActivate (): boolean {
    if (this.auth.loginOn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
    
  }

```

Instalamos 
ng g s service/tokenInterceptor

en app.module.ts

agregamos 

```
import { TokenInterceptorService } from './service/token-interceptor.service';
```
y en provider pero usando un interceptor

modificamos y agregamos
```
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
```
```
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
```

Este ultimo lo colocamos en imports
```
providers: [AuthService, AuthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
```
Ahora vamos a token-interceptor.service.ts


Importamos y nos require un intercept donde solo usamos algunos de los que coloca

```
import { Injectable } from '@angular/core';
import { HttpInterceptor} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private auth: AuthService) { }
  
  
  intercept(req, next){
    const tokenReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.auth.obtenerToken()
      }
    })
    return next.handle(tokenReq);
  }
}
```



Ahora creamos el servicio tablero

ng g s service/tablero

editamos tablero.service.ts

```
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableroService {
  constructor(private http: HttpClient) {}

  private listaUrl = 'http://localhost:3000/api/tablero/lista';
  private crearUrl = 'http://localhost:3000/api/tablero';

  listaActividad() {
    return this.http.get<any>(this.listaUrl);
  }
  crearActividad(tablero) {
    return this.http.post<any>(this.crearUrl, tablero);
  }

  editarActividad(tablero) {
    return this.http.put<any>(this.crearUrl, tablero);
  }
  
  eliminarActividad(tablero) {
    const _id = tablero._id
    const url = `${this.crearUrl}/${_id}`;
    return this.http.delete<any>(url);
  }
}
```

En app.module.ts importamos 
```
import { TableroService } from './service/tablero.service';
```
y lo agregamos a providers
```
providers: [
    TableroService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
```

Vamos a crear.component.ts

Y creamos la function crear y colocamos el import
Aquí también colocamos una redirección para que luego de crear vaya a listarActividad
```
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';
import { TableroService } from '../../service/tablero.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class CrearComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private tablero: TableroService
  ) {}

  crearActividad = {
    nombre: '',
    estado: '',
    descripcion: '',
  };
  ngOnInit(): void {}

  crear() {
    this.tablero.crearActividad(this.crearActividad).subscribe(
      (res) => {
        console.log(res);
         this.router.navigate(['/listarActividad']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
```

Ahora vamos a listar 
Vamos a angular material y nos traemos en la API
Expansión panel 

Y en app.module.ts lo colocamos 
```
import { ListarComponent } from './tablero/listar/listar.component';
```
y su import

ahora en el css de listar

```
mat-expansion-panel-header {
  background-color: rgb(165, 190, 190);
}

.accordion_display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.accordion_size {
  min-width: 150px;
  max-width: 500px;
  width: 100%;
}

mat-form-field {
  margin-right: 12px;
}

.spacer {
  flex: 1 0 auto;
}

.mat-icon {
  padding-right: 15px;
}

.mat-icon:hover {
  color: #ff0000;
  cursor: pointer;
  padding-right: 15px;
}

.btDone {
  background-color: #3cb44b;
  color: #ffffff;
}

.btInProgress {
  background-color: #3e31f5;
  color: #ffffff;
}

.btToDo {
  background-color: #e67c19;
  color: #ffffff;
}

.btSelectDone {
  color: #3cb44b;
}

.btSelectInProgress {
  color: #3e31f5;
}

.btSelectTodo {
  color: #e67c19;
}

.text_center {
  margin-top: auto;
  margin-bottom: auto;
}

.image_center {
  margin-left: auto;
  margin-right: auto;
  max-width: 450px;
}
```

Y ahora listar.component.ts
Importamos el servicio de tablero y lo declaramos en el constructor
Creamos dos métodos para eliminar lista o modificar el estado y creamos una lista que será un array de jsons

Usamos el ngOnInit para que aparezca antes que aparezca el modulo

```
import { Component, OnInit } from '@angular/core';

import { TableroService } from '../../service/tablero.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  constructor(private tablero: TableroService) {}

  lista = [];

  ngOnInit(): void {
    this.tablero.listaActividad().subscribe(
      (res) => {
        this.lista = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  cambiarEstado(listaElegida, estado) { 
    const estadoTemp = listaElegida.estado;
    listaElegida.estado = estado;
    this.tablero.editarActividad(listaElegida).subscribe(
      (res) => {
        listaElegida.estado = estado;
      },
      (err) => {
        console.log(err);
        listaElegida.estado = estadoTemp;
      }
    )
  }

  eliminar(eliminarLista) { 
    this.tablero.eliminarActividad(eliminarLista).subscribe(
      (res) => {
        const index = this.lista.indexOf(eliminarLista);
        if (index > -1) {
          this.lista.splice(index, 1);
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
}

```
 Ahora vamos al HTML listar.component.html

```
<div class="accordion_display">
  <div class="accordion_size">
    <mat-accordion multi="true" *ngIf="lista.length">
      <mat-expansion-panel *ngFor="let lista of lista" hiddenToggle="false">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <span class="text_center">{{ lista.nombre }}</span>
            <span class="spacer"></span>
            <button class="btDone" *ngIf="lista.estado == 'terminada'" mat-raised-button>{{ lista.estado }}</button>
            <button class="btInProgress" *ngIf="lista.estado == 'iniciada'" mat-raised-button>{{ lista.estado }}</button>
            <button class="btToDo" *ngIf="lista.estado == 'asignada'" mat-raised-button>{{ lista.estado }}</button>
          </mat-panel-title>
        </mat-expansion-panel-header>
        <mat-panel-description>
          {{ lista.descripcion }}
        </mat-panel-description>
        <mat-action-row>
          <button class="btSelectTodo" mat-button (click)="cambiarEstado(lista, 'asignada')">Asignada</button>
          <button class="btSelectInProgress" mat-button (click)="cambiarEstado(lista, 'iniciada')">Asignada</button>
          <button class="btSelectDone" mat-button (click)="cambiarEstado(lista, 'terminada')">Terminada</button>
          <span class="spacer"></span>
          <mat-icon color="primary" (click)="eliminar(lista)" arial-Label="delete_forever">delete_forever</mat-icon>
        </mat-action-row>
      </mat-expansion-panel>
    </mat-accordion>
  </div>
</div>
```

AHORA VAMOS A ESCONDER LOGIN Y REGISTRO LUEGO DE QUE LA PERSONA SE LOGUEA

Vamos al auth.service.ts
Importamos 
```
import { Router } from '@angular/router';
```
Luego lo declaramos en el constructor
```
private router: Router
```
y creamos un método llamado cerrarSesion(){}
```
cerrarSesion() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
```
Vamos a borrar en el localstorage y apenas lo haga nos redirecciona a login.

Ahora vamos a menú.component.ts
```
import { AuthService } from '../service/auth.service';


constructor(public auth: AuthService)
```
Tambien vamos al menu.component.html
Y ubicamos lo que va a desaparecer y le implantamos un *ngIf


```
<mat-toolbar class="menu">
    <mat-icon aria-hidden="false" aria-label="event">event</mat-icon>
    <ul>
        <a routerLink="crearActividad"> Crear actividad </a>
    </ul>
    <span class="spacerIcon"></span>
    <mat-icon aria-hidden="false" aria-label="fact_check">fact_check</mat-icon>
    <ul>
        <a routerLink="listarActividades"> Lista de actividades </a>
    </ul>

    <span class="spacer"></span>
    <ul>
        <mat-icon *ngIf="!auth.loginOn()" aria-hidden="false" aria-label="account_box">account_box</mat-icon>
        <a *ngIf="!auth.loginOn()" routerLink="login"> Login</a>
    </ul>
    <ul>
        <mat-icon *ngIf="!auth.loginOn()" aria-hidden="false" aria-label="account_circle">account_circle</mat-icon>
        <a *ngIf="!auth.loginOn()" routerLink="registro"> Registro</a>
    </ul>

    <ul>
        <mat-icon *ngIf="auth.loginOn()" aria-hidden="false" aria-label="login">login</mat-icon>
        <a (click)="auth.cerrarSesion()" *ngIf="auth.loginOn()" mat-button>Cerrar Sesion</a>
    </ul>
</mat-toolbar>
```
Aqui ya se soluciona el problema de auth y e bear token
ya que al cerrar sesion se borra el token del localstorage, y ya que auth es el proceso que genera el token no hay lio.