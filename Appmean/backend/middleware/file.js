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
    const filename =
      Date.now() + "-" + file.originalname.toLowerCase().split(" ").join("-");
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
