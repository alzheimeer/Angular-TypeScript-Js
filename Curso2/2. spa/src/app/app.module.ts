import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './component/about/about.component';
import { HeroeComponent } from './component/heroe/heroe.component';
import { HeroesComponent } from './component/heroes/heroes.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/shared/navbar/navbar.component';
import { HeroesService } from './servicios/heroes.service';
import { BuscadorComponent } from './component/buscador/buscador.component';
import { HeroeTarjetaComponent } from './component/heroe-tarjeta/heroe-tarjeta.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    HeroesComponent,
    HeroeComponent,
    BuscadorComponent,
    HeroeTarjetaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [HeroesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
