import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HeroeModel } from 'src/app/models/heroe.model';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {


  heroe: HeroeModel = new HeroeModel();

  constructor() { }

  ngOnInit(): void {
  }

  guardar(form: NgForm){
    console.log(form);
    console.log(this.heroe);
  }
}
