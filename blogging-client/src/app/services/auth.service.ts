import { Router } from '@angular/router';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

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

  constructor(private http: HttpClient, private router : Router) { }
 
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
    localStorage.removeItem('token');
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

  getToken(){
    return localStorage.getItem('token');
  }

}
