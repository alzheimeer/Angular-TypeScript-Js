import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PruebaComponent } from './prueba/prueba.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { Componente1Component } from './home/componente1/componente1.component';
import { Componente2Component } from './home/componente2/componente2.component';
import { Comp1Component } from './contact/comp1/comp1.component';
import { Comp2Component } from './contact/comp2/comp2.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRouter: Routes = [
  { path: 'pagina1', component: Componente1Component },
  { path: 'pagina2', component: Componente2Component },
  { path: '', redirectTo: '/pagina1', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    PruebaComponent,
    MenuComponent,
    FooterComponent,
    Componente1Component,
    Componente2Component,
    Comp1Component,
    Comp2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    RouterModule,
    RouterModule.forRoot(appRouter),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
