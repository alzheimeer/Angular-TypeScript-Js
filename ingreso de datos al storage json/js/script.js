const formulario = document.getElementById('formregistro')
let listaDeUsuario = [];

formulario.addEventListener('submit', () => {


        const nombre = document.getElementById('name').value
        const celular = document.getElementById('celular').value
        const correo = document.getElementById('correo').value

        const usuario = {
                nombre: nombre,
                celular: celular,
                correo: correo
        }

        pasarStorage(usuario)
})


const pasarStorage = (usuario) => {

        listaEnStorage = JSON.parse(localStorage.getItem("usuarios"))
        listaEnStorage.push(usuario)
        const usuariosString = JSON.stringify(listaEnStorage)
        localStorage.setItem('usuarios', usuariosString)
}