import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserId: string;
  currentUserName: string;

  constructor( private http: HttpClient ) {}

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

  getPostById(id: string) {
    return this.http.get('http://127.0.0.1:3000/api/getPostById/' + id,
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addPost(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/addPost', body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  showPost() {
    return this.http.get('http://127.0.0.1:3000/api/allPost',
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addComment(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/addComment', body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getCommentsByPostId() {
    return this.http.get('http://127.0.0.1:3000/api/getCommentsByPostId',
    {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
}
