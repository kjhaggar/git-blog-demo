import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  authToken: any;
  user: string;
  URL = 'http://127.0.0.1:3000/api';
  // URL = 'https://backend-blogging-appliaction.herokuapp.com/api';

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

  login(body: any) {
    return this.http.post(this.URL + '/login', body,
      {
        observe: 'body',
        withCredentials: true,
        headers: new HttpHeaders().append('Content-Type', 'application/json')
      });
  }

  socialLogin(body: any) {
    return this.http.post(this.URL + '/socialLogin', body,
      {
        observe: 'body',
        withCredentials: true,
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

  async storeUserData(data, userData?) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', data.userName || data.name);
    localStorage.setItem('userId', data.userId || userData._id);
    this.authToken = data.token;
    this.user = data.user;

    return this.router.navigate(['/home']);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
