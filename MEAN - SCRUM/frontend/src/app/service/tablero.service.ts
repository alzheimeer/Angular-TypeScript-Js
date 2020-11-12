import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableroService {
  constructor(private http: HttpClient) {}

  private listaUrl = 'http://localhost:3000/api/tablero/lista';
  private crearUrl = 'http://localhost:3000/api/tablero';

  listaActividad() {
    return this.http.get<any>(this.listaUrl);
  }
  crearActividad(tablero) {
    return this.http.post<any>(this.crearUrl, tablero);
  }

  editarActividad(tablero) {
    return this.http.put<any>(this.crearUrl, tablero);
  }
  
  eliminarActividad(tablero) {
    const _id = tablero._id
    const url = `${this.crearUrl}/${_id}`;
    return this.http.delete<any>(url);
  }
}
