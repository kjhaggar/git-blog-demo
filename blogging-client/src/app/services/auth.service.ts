import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserId: string;
  currentUserName: string;
  domain = "http://localhost:3000/";
  authToken;
  user;
  options;

  constructor(private http: HttpClient) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }
  loadToken() {
    this.authToken = localStorage.getItem('token');
  }
 
  register(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/register', body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  login(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/login', body,
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear(); 
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token; 
    this.user = user;
  }

  loggedIn() {
    return tokenNotExpired();
  }

}
