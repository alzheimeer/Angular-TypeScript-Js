import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  loguear = {
    correo: '',
    pass: '',
  };
  ngOnInit(): void {}
  login() {
    this.auth.loginUsuario(this.loguear).subscribe(
      (res) => {
        console.log(res);
        console.log('Guard token en localstorage');
        localStorage.setItem('token', res.jwtToken);
        this.router.navigate(['/listarActividades']);
      },
      (err) => console.log(err)
    );
  }
}
