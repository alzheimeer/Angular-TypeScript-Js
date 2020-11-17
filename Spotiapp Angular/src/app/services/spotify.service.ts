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
        const headers = new HttpHeaders({ 'Authorization': 'Bearer BQB9DI2qLIeaZUFqX5XLaBiht4hOISHKjygROrsdeEGjqIFzsn8KD02rwpvKYjm9LEMhOn1UrlQIqdI86V8' });
        return this.http.get(url, { headers });
    }
    getNewReleases() {
        return this.getQuery('browse/new-releases?limit=20').pipe(map(res => res['albums'].items));
    }
    getArtistas(termino:string) {
        return this.getQuery(`search?q=${termino}&type=artist&limit=15`).pipe(map(res => res['artists'].items));
    }
    getArtista(id:string) {
        return this.getQuery(`artists/${id}`);
    }
    getTopTracks(id:string) {
        return this.getQuery(`artists/${id}/top-tracks?country=us`).pipe(map(res => res['tracks']));
    }
}
