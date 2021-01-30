let screen = document.getElementById('screen');
let screen1 = document.getElementById('screen1');
const buttons = document.querySelectorAll("#buttons a");
const retro = document.getElementById('retro');
const dark = document.getElementById('dark');





for (const button of buttons) {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        let numero = (e.target.dataset.key)[1];
        let letra = (e.target.dataset.key)[0];
        n = screen.textContent.length;
        n1 = screen1.textContent.length;

        if (e.target.dataset.key == 'reset') {
            screen.textContent = ''
            screen1.textContent = ''
        }

        if (screen.textContent.indexOf(letra, 0) != -1 && n < 10)
            alert("LETRA REPETIDA");
        if (screen1.textContent.indexOf(numero, 0) != -1 && n1 < 10)
            alert("NUMERO REPETIDO");


        if ((numero == 0 && n == 9) || (numero == 0 && n1 == 9))
            numero = 10;
        if (n < 10) {
            if (numero == n + 1)
                screen.textContent = screen.textContent + letra;
            else
                alert("DEBES INGRESAR EL SIGUIENTE ORDEN: ABCDEFGHJ");
        } else if (n1 < 10) {
            if (numero == n1 + 1) {
                if (numero == 10)
                    numero = 0;
                screen1.textContent = screen1.textContent + numero;
            } else
                alert("DEBES INGRESAR EL SIGUIENTE ORDEN: 1234567890");
        }

    });
}

dark.addEventListener('change', () => {
    if (dark.checked == true) {
        document.getElementById('container').classList.add('dark')
        const temaactual = localStorage.getItem('colorTema')
        document.getElementById('container').classList.remove(temaactual)
        localStorage.setItem("colorTema", 'dark')
    } else {
        document.getElementById('container').classList.remove('dark')
        localStorage.setItem("colorTema", '')
    }

});



retro.addEventListener('change', () => {
    if (retro.checked == true) {
        document.getElementById('container').classList.add('retro')
        const temaactual = localStorage.getItem('colorTema')
        document.getElementById('container').classList.remove(temaactual)
        localStorage.setItem("colorTema", 'retro')
    } else {
        document.getElementById('container').classList.remove('retro')
        localStorage.setItem("colorTema", '')
    }
});