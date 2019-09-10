import { IUsers } from './../../Interface/users';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {private SOCKET = io('http://127.0.0.1:3000');
// private SOCKET = io ('https://backend-blogging-appliaction.herokuapp.com');
  public currentUserId: string;
  public currentUserName: string;
  public searchText: string;
  public items: any;
  public url: string;
  public newFriend: any;
  public friendRequestSent = [];
  public newFriendRequest = false;
  public friendsInfo: any;
  public pendingRequest: any;
  public acceptRequest = [];
  public newFriendAdded: boolean;

  constructor(private sanitized: DomSanitizer, private userService: UserService ) {

    this.userService.newRequestReceived().subscribe(
      data => {
        if (this.currentUserId === data.receiverId) {
          this.newRequest();
        }
      },
      error => console.log(error)
    );

    this.userService.canceledRequestReceived().subscribe(
      data => {
        if (this.currentUserId === data) {
        this.newRequest();
        this.acceptRequest[data] = false;
        this.friendRequestSent[data] = false;
        }
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
      this.currentUserId = localStorage.getItem('userId');
      this.currentUserName = localStorage.getItem('user');
      this.friends();
      this.sentRequest();
      this.newRequest();
      this.userService.getUsersList().subscribe(
        data => {
          this.items = data;
        },
        error => console.log(error)
      );
  }

  GetImageUrl(filename) {
    if (filename === undefined) {
      this.url = 'http://localhost:3000/images/download.jpeg';
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
    } else {
      this.url = 'http://localhost:3000/images/' + filename;
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + filename;
    }
    return this.sanitized.bypassSecurityTrustUrl(this.url);
  }

  newRequest() {
    this.userService.RequestList(this.currentUserId).subscribe(
      (data: any) => {
        this.newFriendRequest = true;
        this.newFriend = data.pendingUserProfile;
        for (const i of data.pendingRequestId) {
          this.acceptRequest[data.pendingRequestId[i]] = true;
        }
      },
      error => console.log(error)
    );
  }

  CancelFriendRequest(userId: string) {
    this.userService.cancelFriendRequest(this.currentUserId, userId).subscribe(
      data => {
        this.SOCKET.emit('cancelFriendRequest', this.currentUserId);
        this.acceptRequest[userId] = false;
        this.friendRequestSent[userId] = false;
        this.newRequest();
        this.sentRequest();
      },
      error => console.error(error)
    );
  }

  AcceptFriendRequest(friendId: string, friendUserName: string) {
    this.userService.changeRequestStatus(this.currentUserId, friendId).subscribe(
      data => {
        console.log(data)
        this.acceptRequest[friendId] = false;
        this.friendRequestSent[friendId] = false;
        this.SOCKET.emit('acceptFriendRequest', this.currentUserId);
        this.updateFriendList(this.currentUserId, this.currentUserName, friendId, friendUserName);
        this.updateFriendList(friendId, friendUserName, this.currentUserId, this.currentUserName);
        this.newFriendAdded = true;
        this.newRequest();
      },
      error => console.log(error)
    );
  }

  updateFriendList(userId: string, userName: string, friendId: string, friendUserName: string) {
    this.userService.acceptFriendRequest(userId, userName, friendId, friendUserName).subscribe(
      data => {
        this.newRequest();
        this.friends();
      },
      error => console.log(error)
    );
  }

  DeleteFriendRequest(userId: string) {
    this.userService.deleteFriendRequest(userId, this.currentUserId).subscribe(
      data => {
        this.SOCKET.emit('cancelFriendRequest', this.currentUserId);
        this.acceptRequest[userId] = false;
        this.friendRequestSent[userId] = false;
        this.newRequest();
        this.sentRequest();
      },
      error => console.error(error)
    );
  }

  friends() {
    this.userService.FriendsList(this.currentUserId).subscribe(
      data => {
        this.friendsInfo = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  sentRequest() {
    this.userService.SentRequestList(this.currentUserId).subscribe(
      data => {
        for (const i of data as Array<string>) {
          this.friendRequestSent[data[i]] = true;
        }
      },
      error => console.log(error)
    );
  }

  FadeOutSuccessMsg() {
    setTimeout(() => {
      this.newFriendAdded = false;
    }, 4000);
  }

  sendRequestButton(receiverId: string) {
    const request = {
      receiverId,            // receiver of friend request
      senderId: this.currentUserId    // sender of friend request
    };
    this.userService.sendRequest(request).subscribe(
      data => {
        this.SOCKET.emit('friendRequest', request);
        this.friendRequestSent[request.receiverId] = true;
      },
      error => console.log(error)
    );
  }

  usersInfo(profile: IUsers) {
    this.userService.setUsersProfile(profile);
  }}
