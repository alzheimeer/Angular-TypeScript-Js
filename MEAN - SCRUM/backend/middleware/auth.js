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
