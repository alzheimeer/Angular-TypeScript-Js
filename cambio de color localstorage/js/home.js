const nombredeusuario = document.getElementById('usuario')
const limpiar = document.getElementById('limpiar')

const usuarioenstorage = localStorage.getItem('nombreusuario')
nombredeusuario.innerText = usuarioenstorage
limpiar.addEventListener('click', ()=>{
    //localStorage.clear()
    localStorage.removeItem('nombreusuario')
    localStorage.removeItem('apellidousuario')
    window.location.reload()
})
console.log(usuarioenstorage)
