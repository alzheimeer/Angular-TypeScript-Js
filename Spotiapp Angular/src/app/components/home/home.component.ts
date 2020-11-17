import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../../services/spotify.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    nuevasCanciones: any[] = []
    loading: boolean = true;

    constructor(private spotify: SpotifyService) {
        this.spotify.getNewReleases().subscribe((res: any) => {
            this.nuevasCanciones = res
            this.loading = false;
        });
    }


    ngOnInit(): void {
    }

}
