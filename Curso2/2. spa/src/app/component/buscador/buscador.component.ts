import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeroesService } from '../../servicios/heroes.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

    heroes:any[] = [];
    termino: string;

    constructor(private activatedRoute: ActivatedRoute,
        private _heroesService: HeroesService, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe( params =>{
            this.termino = params['termino'];
            this.heroes = this._heroesService.buscarHeroe(params['termino']);
            console.log(this.heroes); 
        }
        )
    }
    verHeroe(idx: number) {
        this.router.navigate(['/heroe', idx]);
    }

}
