import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {

    constructor(private http: HttpClient) { }

    getQuery(query: string) {
        const url = `https://api.spotify.com/v1/${query}`;
        const headers = new HttpHeaders({ 'Authorization': 'Bearer BQCby79PAwgY6u5dDCFLeS4bZ6rf_vhjVMyOyRQSvDiryh1tTGEA5POLiao432m6YcaWf73i85cGxO6j9fo' });
        return this.http.get(url, { headers });
    }
    getNewReleases() {
        return this.getQuery('browse/new-releases?limit=20').pipe(map(res => res['albums'].items));
    }
    getArtista(termino) {
        return this.getQuery(`search?q=${termino}&type=artist&limit=15`).pipe(map(res => res['artists'].items));
    }
}
