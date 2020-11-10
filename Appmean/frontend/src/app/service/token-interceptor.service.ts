import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(req, next) {
    const token = this.auth.obtenerToken();
    if (!token) {
      return next.handle(req);
    }

    const tokenReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token }, });
    return next.handle(tokenReq);
  }
}
