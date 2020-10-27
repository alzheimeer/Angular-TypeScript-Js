import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cardsts',
  templateUrl: './cardsts.component.html',
  styleUrls: ['./cardsts.component.css']
})
export class CardstsComponent implements OnInit {

  constructor() {
   
    
  }
  
  ngOnInit(): void {
    //URL de la API
    const urlAPI = "https://rickandmortyapi.com/api/character";
    this.obtenerInfo(urlAPI)
  }

 
//Obtener retorno de la API
  obtenerInfo(url) {
   
        return fetch(url)
                .then((respuesta) => respuesta.json())
                .then((json) => {
                        this.llenarDatos(json), this.paginacion(json.info);
                })
                .catch((error) => {
                        console.log("Error: ", error);
                });
};

//llenar datos en nuestra pagina
llenarDatos(data) {
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
paginacion(data) {

        let prevDisable = "";
        let nextDisable = "";

        data.prev == null ? prevDisable = "disabled" : prevDisable = "";
        data.next == null ? nextDisable = "disabled" : nextDisable = "";

        //document.getElementById('next').addEventListener('click', onClick);
        //function onClick() {
        //this.obtenerInfo(data.next);
        //}
        //this.obtenerInfo("https://rickandmortyapi.com/api/character?page=2");
        //this.obtenerInfo(data.next);
//<button class="btn btn-primary" (click)="obtenerInfo('dsadsadsad')" type="button">Call</button>
  //let btn = document.createElement("button");
  //btn.innerHTML = "CLICK ME";
  //btn.setAttribute("click", "obtenerInfo('dsadsadsad')");
  //btn.setAttribute("type", "button");
  //btn.setAttribute("id", "next");
  //btn.setAttribute("class", "btn btn-primary");
  //btn.onchange = function () {
   //             hello();
    //        };
     // script.class = "btn btn-primary"
      //script.src = "./assets/js/" + archivo + ".js";
  //let header = document.getElementsByTagName('header')[0];
      //var currentDiv = document.getElementById("paginacion"); 
      //document.body.insertBefore(script, currentDiv); 
    // header.appendChild(btn);
  
  
  
  
  
  
  
       let html = "";
       html += `<li class="page-item ${prevDisable}"><a class="page-link" (click)="obtenerInfo('${data.prev}')">Previous</a></li>`;
       //html += `<button class="btn btn-primary" (click)="obtenerInfo('dsadsadsad')" type="button">Call</button>`;
       html += `<li class="page-item ${nextDisable}"><button class="btn btn-primary" (click)="CallClick()" type="button">Next</button></li>`;
       document.getElementById("paginacion").innerHTML = html;
   

    //let btn = (<HTMLInputElement>document.getElementById("next"));
    //btn?.addEventListener("click", getTrainingName);
    //function getTrainingName(){
    //  this.obtenerInfo(data.next);
    //}
}

  
}
