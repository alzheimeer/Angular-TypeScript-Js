import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    nuevasCanciones: any[] = []
    loading: boolean;
    mensajeError: string;
    error: boolean;

    constructor(private spotify: SpotifyService) {

        this.loading= true;
        this.error = false;

        this.spotify.getNewReleases().subscribe((res: any) => {
            this.nuevasCanciones = res
            this.loading = false;
        }, (error_Servicio) => {
                this.loading = false;
                this.error = true;
                this.mensajeError = error_Servicio.error.error.message;
        });
    }


    ngOnInit(): void {
    }

}
