import { Component, OnInit } from '@angular/core';

import { TableroService } from '../../service/tablero.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  constructor(private tablero: TableroService) { }

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
