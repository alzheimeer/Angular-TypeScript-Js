import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizado'
})
export class CapitalizadoPipe implements PipeTransform {

    transform(value: string, ...args: unknown[]): string {
      
        value = value.toLowerCase();
        let nombres = value.split(' ');
        
        if (args[0]) {
            nombres = nombres.map(nombre => {
                return nombre[0].toUpperCase() + nombre.substr(1);
            })
            return nombres.join(' ');
        } else {

            nombres = nombres.map(nombre => {
                return nombre[0] + nombre[1].toUpperCase() + nombre.substr(2);
            })
            return nombres.join(' ');
        }
    
  }

}
