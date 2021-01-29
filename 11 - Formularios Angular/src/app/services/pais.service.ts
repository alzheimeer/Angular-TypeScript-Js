import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor( private http: HttpClient) { }

  getPaises(){
    //return this.http.get('https://restcountries.eu/rest/v2/lang/es').pipe(map(function(x:any) {return x.map(function(y:any) {return {nombre: y.name, codigo: y.alpha3Code}})}));
    //return this.http.get('https://restcountries.eu/rest/v2/lang/es').pipe(map((x:any) => {return x.map((y:any) => {return {nombre: y.name, codigo: y.alpha3Code}})}));
    return this.http.get('https://restcountries.eu/rest/v2/lang/es').pipe(map((x:any) => (x.map((y:any) => ({nombre: y.name, codigo: y.alpha3Code})))));

  }
}







