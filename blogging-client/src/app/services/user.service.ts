import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { IUsers } from '../Interface/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private socket = io('https://backend-blogging-appliaction.herokuapp.com');
  // url = 'https://backend-blogging-appliaction.herokuapp.com/api/';

  private socket = io('http://127.0.0.1:3000');
  private url = 'http://127.0.0.1:3000/api/';
  private usersInfo;

  constructor(private http: HttpClient) { }

  sendRequest(body) {
    return this.http.post(this.url + 'sendRequest', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  sendNotification(body) {
    return this.http.post(this.url + 'storeTaggedUsers', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUsersList() {
    return this.http.get(this.url + 'getUsersList/', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getProfileData(userId: string) {
    return this.http.get(this.url + 'getProfileData/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getPostById(id: string) {
    return this.http.get(this.url + 'getPostById/' + id, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getBlogById(id: string) {
    return this.http.get(this.url + 'getBlogById/' + id, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addPost(formData: any) {
    return this.http.post(this.url + 'addPost', formData, {
      observe: 'body',
      withCredentials: true
    });
  }

  showPost() {
    return this.http.get(this.url + 'allPost', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addComment(body: any) {
    return this.http.post(this.url + 'addComment', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  addReply(body: any) {
    return this.http.post(this.url + 'addReply', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  updatePost(postId: any, body: any) {
    return this.http.put(this.url + 'updatePost/' + postId, body, {
      observe: 'body',
      withCredentials: true,
      // headers: new HttpHeaders().append('Content-Type','application/json')
    });
  }
  changePostStatus(blogIdList: any, userName: string) {
    const body = {
      blogIdList,
      userName
    };
    return this.http.put(this.url + 'changePostStatus', body, {
      observe: 'body',
      withCredentials: true,
      // headers:new HttpHeaders().append('Content-Type','application/json')
    });
  }

  changeRequestStatus(userId: string, friendId: string) {
    const body = {
      user: userId,
      friend: friendId
    };
    return this.http.put(this.url + 'changeRequestStatus', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  updatePendingReqStatus(userId: string) {
    return this.http.put(this.url + 'changePendingRequestStatus/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  deletePost(postId: string) {
    return this.http.delete(this.url + 'deletePost/' + postId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  displayProfile() {
    return this.http.get(this.url + 'displayProfilePicture/', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  deleteProfilePicture(userId: string) {
    return this.http.delete(this.url + 'deleteProfilePicture/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  RequestList(userId: string) {
    return this.http.get(this.url + 'requestList/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  SentRequestList(userId: string) {
    return this.http.get(this.url + 'sentRequestList/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  FriendsList(userId: string) {
    return this.http.get(this.url + 'friendsList/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  NotificationList(userName: string) {
    return this.http.get(this.url + 'getNotified/' + userName, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getpublicBlog(userName: string, userId: string) {
    return this.http.get(this.url + 'publicBlog/' + userName + '/' + userId, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }


  acceptFriendRequest(userId: string, userName: string, friendId: string, friendUserName: string) {
    const body = {
      userId,
      userName,
      friendId,
      friendUserName
    };
    return this.http.put(this.url + 'acceptFriendRequest', body, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }
  deleteFriendRequest(userId: string, requestToId: string) {
    return this.http.request('DELETE', this.url + 'deleteFriendRequest', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      body: {
        user: userId,
        requestTo: requestToId
      }
    });
  }

  cancelFriendRequest(userId: string, requestToId: string) {
    return this.http.request('DELETE', this.url + 'deleteFriendRequest', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      body: {
        user: userId,
        requestTo: requestToId
      }
    });
  }

  tagUser() {
    return this.http.get(this.url + 'tagUser', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  deleteBlogImage(imageId: string, postId: string) {
    return this.http.request('DELETE', this.url + 'deleteBlogImage', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      body: {
        imageId,
        postId
      }
    });
  }

  deleteComment(commentId: string, postId: string) {
    return this.http.request('DELETE', this.url + 'deleteComment', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      body: {
        commentId,
        postId
      }
    });
  }

  deleteReply(replyId: string, commentId: string, postId: string) {
    return this.http.request('DELETE', this.url + 'deleteReply', {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      body: {
        replyId,
        commentId,
        postId
      }
    });
  }

  ResetPwdMail(email: string) {
    const body = {
      email
    };
    return this.http.post(this.url + 'resetPassword', body, {
      observe: 'body',
      withCredentials: true
    });
  }

  setNewPassword(token: string) {
    return this.http.get(this.url + 'reset/' + token, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  updatedPassword(token: string, password: string) {
    const body = {
      password
    };
    return this.http.post(this.url + 'reset/' + token, body, {
      observe: 'body',
      withCredentials: true
    });
  }

  verifyAccount(token: string) {
    return this.http.get(this.url + 'verifyAccount/' + token, {
      observe: 'body',
      withCredentials: true,
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  newCommentReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('new comment', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  newReplyReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('new reply', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  newPostReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('new post', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  newRequestReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('newFriendRequest', (friend) => {
        observer.next(friend);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  canceledRequestReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('cancelRequest', (userId) => {
        observer.next(userId);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  acceptRequestReceived() {
    const observable = new Observable<any>(observer => {
      this.socket.on('acceptRequest', (userId) => {
        observer.next(userId);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  newTag() {
    const observable = new Observable<any>(observer => {
      this.socket.on('newTag', (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }

  setUsersProfile(profile: IUsers) {
    this.usersInfo = profile;
  }

  getUsersProfile() {
    return this.usersInfo;
  }
}
