import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: string;
  url = 'http://127.0.0.1:3000/api';
  // url = 'https://backend-blogging-appliaction.herokuapp.com/api';

  constructor(private http: HttpClient, private router: Router) { }

  register(body: any) {
    return this.http.post(this.url + '/register', body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(body: any) {
    return this.http.post(this.url + '/login', body,
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
    this.router.navigate(['/login']);
  }

  storeUserData(token, user, userId) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    localStorage.setItem('userId', userId);
    this.authToken = token;
    this.user = user;
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
