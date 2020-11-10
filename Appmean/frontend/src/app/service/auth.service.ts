import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registroUrl = 'http://localhost:3000/api/usuario/';
  private loginUrl = 'http://localhost:3000/api/auth';
  constructor(private http: HttpClient) { }
  // Creamos un obserbable
  // usuario seria un json
  registroUsuario(usuario) {
    return this.http.post<any>(this.registroUrl, usuario);
  }
  loginUsuario(usuario) {
    return this.http.post<any>(this.loginUrl, usuario);
  }

  loginOn() {
    //!! convierte en true o false
    //hay o no hay token
    return !!localStorage.getItem('token');
  }

  obtenerToken() {
    //devuelve el token
    return localStorage.getItem('token');
  }
}
