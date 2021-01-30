import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Lista } from '../models/lista.model';
import { DeseosService } from '../services/deseos.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    items: Lista[] = [];

    constructor(public deseosServices: DeseosService, private router: Router, public alertController: AlertController) {
        this.items = deseosServices.listas;
    }
    
    async agregarLista() {
         const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Nueva Lista',
            inputs: [
                {
                    name: 'titulo',
                    type: 'text',
                    placeholder: 'Nombre de la lista'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancelar');
                    }
                },
                {
                    text: 'Crear',
                    handler: ( data ) => {
                        console.log(data);
                        if (data.titulo.lenght === 0) {
                            return;
                        }
                        
                        const listaId = this.deseosServices.crearLista(data.titulo);
                        

                        this.router.navigateByUrl(`/tabs/tab1/agregar/${listaId}`);

                    }
                }
            ]
        });

        alert.present();
    }

   

    
}
