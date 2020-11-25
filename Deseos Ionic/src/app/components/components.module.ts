import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { PipesModule } from '../pipes/pipes.module';
import { ListasComponent } from './listas/listas.component';



@NgModule({
    declarations: [
      ListasComponent
    ],
    exports: [
      ListasComponent  
    ],
  imports: [
      CommonModule, 
      IonicModule,
      PipesModule
  ]
})
export class ComponentsModule { }
