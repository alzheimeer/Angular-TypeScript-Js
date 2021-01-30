const saludar = document.getElementById('pp')

saludar.addEventListener('click', ()=>{

    const nombreusuario = prompt('escribe nombre')
    localStorage.setItem("nombreusuario", nombreusuario)
    const apellidousuario = prompt('escribe apellido')
    localStorage.setItem("apellidousuario", apellidousuario)
})

console.log(saludar)