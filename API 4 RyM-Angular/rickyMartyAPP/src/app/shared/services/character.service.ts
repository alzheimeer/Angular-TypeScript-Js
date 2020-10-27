import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from '@shared/interfaces/character.interfaces';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  searchCharacters(query = '', page = 1) {
    const filter = `${environment.baseUrlAPI}/?name=${query}&pages=${page}`;
    return this.http.get<Character[]>(filter);
  }
  getDetails(id: number) {
    return this.http.get<Character>(`${environment.baseUrlAPI}/${id}`);
  }
}
