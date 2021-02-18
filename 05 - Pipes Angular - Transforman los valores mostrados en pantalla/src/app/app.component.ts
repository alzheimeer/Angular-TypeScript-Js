import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
    name: string = 'Capitan America';
    
    name2: string = 'EdGaR CArlOs maUriCio QuiNTero RoMERo'

  array = [
    'IronMan',
    'Spiderman',
    'Thor',
    'Loki',
    'Groot',
    'Arrow',
    'SuperMan',
    'LinternaVerde',
    'BatWoman',
    'Flash',
  ];

  PI: number = Math.PI;

  porcentaje: number = 35 / 100;

  salario: number = 1234.5;

  heroe = {
    nombre: 'Logan',
    clave: 'Wolverine',
    edad: 500,
    direccion: {
      calle: 'Primera',
      casa: 20,
    },
  };

  valorPromesa = new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('llego la data');
    }, 4500);
  });

    fecha: Date = new Date();
    
    videoUrl = 'https://www.youtube.com/embed/nhXSXizy-FA'
}
