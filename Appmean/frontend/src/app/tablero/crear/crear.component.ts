import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../service/auth.service';
import { TableroService } from '../../service/tablero.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css'],
})
export class CrearComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private tablero: TableroService
  ) {}

  crearActividad = {
    nombre: '',
    estado: '',
    descripcion: '',
  };
  ngOnInit(): void {}

  crear() {
    this.tablero.crearActividad(this.crearActividad).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
