//fecth controla errores mas facil y se basa en promesas, trabaja por medio de http y https
//sistema de peticiones y respuestas

//URL de la API
const urlAPI = "https://rickandmortyapi.com/api/character";

//Obtener retorno de la API
const getData = (url) => {
        return fetch(url)
                .then((respuesta) => respuesta.json())
                .then((json) => {
                        llenarDatos(json), paginacion(json.info);
                })
                .catch((error) => {
                        console.log("Error: ", error);
                });

};
//Alt 96 ``
//lenar datos en nuestra pagina
const llenarDatos = (data) => {
        let html = "";
        data.results.forEach((pj) => {
                html += '<div class="col">';
                html += '<div class="card" style="width: 10rem;">';
                html += `<img class="card-img-top" src="${pj.image}" alt="...">`;
                html += '<div class="card-body">';
                html += `<h5 class="card-title">${pj.name}</h5>`;
                html += `<p class="card-text">Status :${pj.status}</p>`;
                html += `<p class="card-text">Especie :${pj.species}</p>`;
                html += `<p class="card-text">Genero :${pj.gender}</p>`;
                html += '</div>';
                html += '</div>';
                html += '</div>';

        });
        //imprimir datos en html
        document.getElementById("datosPersonajes").innerHTML = html;
}


//Paginacion
const paginacion = (data) => {

        let prevDisable = "";
        let nextDisable = "";

        data.prev == null ? prevDisable = "disabled" : prevDisable = "";
        data.next == null ? nextDisable = "disabled" : nextDisable = "";




        let html = "";
        html += `<li class="page-item ${prevDisable}"><a class="page-link" onclick="getData('${data.prev}')">Previous</a></li>`;
        html += `<li class="page-item ${nextDisable}"><a class="page-link" onclick="getData('${data.next}')">Next</a></li>`;
        document.getElementById("paginacion").innerHTML = html;
}

//invoco la funcion
getData(urlAPI)