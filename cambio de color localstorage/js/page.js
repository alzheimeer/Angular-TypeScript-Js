const dark = document.getElementById('dark')
const light = document.getElementById('light')
const pink = document.getElementById('pink')
const blue = document.getElementById('blue')

dark.addEventListener('click', ()=>{
    document.getElementById('container').classList.add('dark')
    const temaactual = localStorage.getItem('colorTema')
    document.getElementById('container').classList.remove(temaactual)
    localStorage.setItem("colorTema", 'dark')
})

light.addEventListener('click', ()=>{
    document.getElementById('container').classList.add('light')
    const temaactual = localStorage.getItem('colorTema')
    document.getElementById('container').classList.remove(temaactual)
    localStorage.setItem("colorTema", 'light')
})

pink.addEventListener('click', ()=>{
    document.getElementById('container').classList.add('pink')
    const temaactual = localStorage.getItem('colorTema')
    document.getElementById('container').classList.remove(temaactual)
    localStorage.setItem("colorTema", 'pink')
})

blue.addEventListener('click', ()=>{
    document.getElementById('container').classList.add('blue')
    const temaactual = localStorage.getItem('colorTema')
    document.getElementById('container').classList.remove(temaactual)
    localStorage.setItem("colorTema", 'blue')
})