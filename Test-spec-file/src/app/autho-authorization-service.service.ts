import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthoAuthorizationServiceService {
  URL = 'http://127.0.0.1:3000/api';
  authToken: any;
  user: string;

  constructor(private http: HttpClient, private router: Router) { }

  register(body: any) {
    return this.http.post(this.URL + '/register', body,
      {
        observe: 'body',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
  }

  socialRegister(body: any) {
    return this.http.post(this.URL + '/socialRegister', body,
      {
        observe: 'body',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.clear();
    return this.router.navigate(['']);
  }
}
