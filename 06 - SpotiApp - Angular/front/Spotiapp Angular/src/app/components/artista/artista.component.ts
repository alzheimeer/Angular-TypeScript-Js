import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-artista',
    templateUrl: './artista.component.html',
    styleUrls: ['./artista.component.css']
})
export class ArtistaComponent implements OnInit {

    artista: any = {};
    loadingArtist: boolean;
    topTracks: any[] = []

    constructor(private router: ActivatedRoute, private spotify: SpotifyService) {
        this.loadingArtist = true;
        this.router.params.subscribe(respuesta_params => {
            this.getArtista(respuesta_params['id']);
            this.getTopTrack(respuesta_params['id']);
        });
    }

    ngOnInit(): void {
    }

    getArtista(id: string) {
        this.spotify.getArtista(id).subscribe(respuesta_artista => {
            this.artista = respuesta_artista;
            this.loadingArtist = false;
        });
    }

    getTopTrack(id: string) {
        this.spotify.getTopTracks(id).subscribe(respuesta_Tracks => {
            this.topTracks = respuesta_Tracks;
            console.log(this.topTracks);
        })
    }
}
