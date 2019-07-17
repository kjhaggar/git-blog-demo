import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private socket = io('http://127.0.0.1:3000');

  constructor( private http: HttpClient ) {}

  getProfileData(userId: string) {
    return this.http.get('http://127.0.0.1:3000/api/getProfileData/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getPostById(id: string) {
    return this.http.get('http://127.0.0.1:3000/api/getPostById/' + id, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addPost(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/addPost', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  showPost() {
    return this.http.get('http://127.0.0.1:3000/api/allPost', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addComment(body: any) {
    
    return this.http.post('http://127.0.0.1:3000/api/addComment', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addReply(body: any) {
    return this.http.post('http://127.0.0.1:3000/api/addReply', body, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  updatePost(postId: any, body: any){
    return this.http.put('http://127.0.0.1:3000/api/updatePost/' + postId, body, {
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

  deletePost(postId: string){
    return this.http.delete('http://127.0.0.1:3000/api/deletePost/' + postId,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

  displayProfile() {
    return this.http.get('http://127.0.0.1:3000/api/displayProfilePicture/', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  deleteProfilePicture(userId: string){
    return this.http.delete('http://127.0.0.1:3000/api/deleteProfilePicture/' + userId,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders().append('Content-Type','application/json')
    })
  }

    newCommentReceived(){
    let observable = new Observable<any>(observer=>{
        this.socket.on('new comment', (data)=>{
            observer.next(data);
        });
        return () => {this.socket.disconnect();}
    });

    return observable;
    }

    newReplyReceived(){
        let observable = new Observable<any>(observer=>{
            this.socket.on('new reply', (data)=>{
                observer.next(data);
            });
            return () => {this.socket.disconnect();}
        });
    
        return observable;
    }

    newPostReceived(){
            let observable = new Observable<any>(observer=>{
                this.socket.on('new post', (data)=>{
                    observer.next(data);
                });
                return () => {this.socket.disconnect();}
            });
        
            return observable;
    }
   
}
