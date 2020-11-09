import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListarComponent } from './tablero/listar/listar.component';
import { CrearComponent } from './tablero/crear/crear.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from './guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'listarActividades',
    component: ListarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'crearActividad',
    component: CrearComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
