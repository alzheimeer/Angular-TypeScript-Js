import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreciosComponent } from './components/precios/precios.component';
import { ProtegidaComponent } from './components/protegida/protegida.component';
import { CallbackComponent } from './components/callback/callback.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        HomeComponent,
        ProtegidaComponent,
        PreciosComponent,
        CallbackComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,

        // Import the module into the application, with configuration
        AuthModule.forRoot({
            domain: 'dev-9b1lnxbe.us.auth0.com',
            clientId: 'CN3oP9FaFl1gilRiRWwwRHMZfGdzIQXg'
        }),
    ],

    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
