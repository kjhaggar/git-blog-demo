import { UserService } from './../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  private socket = io('http://127.0.0.1:3000');
  // private socket = io ('https://backend-blogging-appliaction.herokuapp.com');
  public id: string;
  public sub: any;
  public getCurrentUserId: string;
  public getCurrentUserName: string;
  private getCurrentProfilePicture: any;
  public url: any;
  public profile: any;
  public friendRequestSent: boolean;
  public friends: boolean;
  public acceptRequest = false;

  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.userService.newRequestReceived().subscribe(
      data => {
        if (this.getCurrentUserId === data.receiverId) {
          this.newRequest();
        }
      },
      error => console.log(error)
    );

    this.userService.canceledRequestReceived().subscribe(
      data => {
        this.newRequest();
        this.acceptRequest = false;
        this.friendRequestSent = false;
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const postId = 'id';
      this.id = params[postId];
    });
    this.getCurrentUserId = localStorage.getItem('userId');
    this.getCurrentUserName = localStorage.getItem('user');

    this.getProfileData();
    this.sentRequest();
    this.newRequest();
  }

  getProfileData() {
    this.userService.getProfileData(this.id).subscribe(
      (data: { user: any }) => {
        this.profile = data.user;
        data.user.friends.forEach(element => {
          if (this.getCurrentUserId === element.friendId) {
            this.friends = true;
          }
        });
        this.getCurrentProfilePicture = data.user.image;
        if (this.getCurrentProfilePicture == null) {
          this.url = 'http://localhost:3000/images/download.jpeg';
          // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
        } else {
          this.url = 'http://localhost:3000/images/' + this.getCurrentProfilePicture;
          // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + this.getCurrentProfilePicture;
        }
      },
      error => {
        console.log(error.message);
      }
    );
  }

  sendRequestButton(receiverId: string) {
    const request = {
      receiverId,            // receiver of friend request
      senderId: this.getCurrentUserId    // sender of friend request
    };
    this.userService.sendRequest(request).subscribe(
      data => {
        this.socket.emit('friendRequest', request);
        this.friendRequestSent = true;
      },
      error => console.log(error)
    );
  }

  sentRequest() {
    this.userService.SentRequestList(this.getCurrentUserId).subscribe(
      (data: { pendingRequestId: Array<string> }) => {
        data.pendingRequestId.forEach(element => {
          this.friendRequestSent = true;
        });
      },
      error => console.log(error)
    );
  }

  newRequest(userId?: string) {
    this.userService.RequestList(this.getCurrentUserId).subscribe(
      (data: { pendingUserProfile: any, pendingRequestId: any }) => {
        for (const i of data.pendingRequestId) {
          this.acceptRequest = true;
        }
      },
      error => console.log(error)
    );
  }

  AcceptFriendRequest(friendId: string, friendUserName: string) {
    this.userService.changeRequestStatus(this.getCurrentUserId, friendId).subscribe(
      data => {
        this.updateFriendList(this.getCurrentUserId, this.getCurrentUserName, friendId, friendUserName);
        this.updateFriendList(friendId, friendUserName, this.getCurrentUserId, this.getCurrentUserName);
        this.newRequest();
      },
      error => console.log(error)
    );
  }

  updateFriendList(userId: string, userName: string, friendId: string, friendUserName: string) {
    this.userService.acceptFriendRequest(userId, userName, friendId, friendUserName).subscribe(
      data => {
        this.newRequest();
        this.getProfileData();
        // this.visitUsersProfile = true;
      },
      error => console.log(error)
    );
  }

  DeleteFriendRequest(userId: string) {
    this.userService.deleteFriendRequest(userId, this.getCurrentUserId).subscribe(
      data => {
        this.socket.emit('cancelFriendRequest', this.getCurrentUserId);
        this.acceptRequest = false;
        this.friendRequestSent = false;
        this.friends = false;
        this.newRequest();
        this.sentRequest();
      },
      error => console.error(error)
    );
  }

  CancelFriendRequest(userId: string) {
    this.userService.cancelFriendRequest(this.getCurrentUserId, userId).subscribe(
      data => {
        this.socket.emit('cancelFriendRequest', this.getCurrentUserId);
        this.acceptRequest = false;
        this.friendRequestSent = false;
        this.newRequest();
        this.sentRequest();
      },
      error => console.error(error)
    );
  }
}
