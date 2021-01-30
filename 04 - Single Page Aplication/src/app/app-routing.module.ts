import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './component/about/about.component';
import { BuscadorComponent } from './component/buscador/buscador.component';
import { HeroeComponent } from './component/heroe/heroe.component';
import { HeroesComponent } from './component/heroes/heroes.component';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'heroes',
        component: HeroesComponent,
    },
    {
        path: 'heroe/:id',
        component: HeroeComponent,
    },
    {
        path: 'buscador/:termino',
        component: BuscadorComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
