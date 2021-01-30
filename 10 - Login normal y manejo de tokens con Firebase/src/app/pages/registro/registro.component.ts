import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

import { UsuarioModel } from '../../models/usuario.models';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

    usuario: UsuarioModel;
    recordarme = false;
    
    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.usuario = new UsuarioModel();
    }

    onSubmit(form: NgForm) {

        if (form.invalid) { return; }

        Swal.fire({
            allowOutsideClick: false,
            text: 'Espere por favor...',
            icon: 'info',
        })
        Swal.showLoading();


        this.auth.nuevoUsuario(this.usuario).subscribe(resp => {
            
            console.log(resp);
            
            Swal.close();

            if (this.recordarme == true) {
                localStorage.setItem('email', this.usuario.email);
            }

            this.router.navigateByUrl('/home');
        }, (err) => {
                console.log(err.error.error.message);
                Swal.fire({
                    allowOutsideClick: false,
                    text: err.error.error.message,
                    title: 'Error Al Autenticar',
                    icon: 'error',
                })
        });
    }


}
