import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(body:any){
    return this.http.post('http://127.0.0.1:3000/api/register',body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }

  login(body:any){
    return this.http.post('http://127.0.0.1:3000/api/login',body,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  addPost(body:any){
    return this.http.post('http://127.0.0.1:3000/api/addPost',body,
    {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }

  showPost(){
    return this.http.get('http://127.0.0.1:3000/api/allPost',{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

}
