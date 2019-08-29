import { UserService } from './../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import { userInfo } from 'os';

@Component({
    selector: 'app-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
    private SOCKET = io('http://127.0.0.1:3000');
    // private SOCKET = io ('https://backend-blogging-appliaction.herokuapp.com');
    public sub: any;
    public id: string;
    public profile: any;
    private currentProfilePicture: any;
    public currentUserId: string;
    public currentUserName: string;
    public url: any;
    public friends: boolean;
    public friendRequestSent: boolean;
    public acceptRequest = false;
    public usersInfo;

    constructor(private route: ActivatedRoute, private userService: UserService) {
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
                this.newRequest();
                this.getProfileData();
                this.acceptRequest = false;
                this.friendRequestSent = false;
            },
            error => console.log(error)
        );

        this.userService.acceptRequestReceived().subscribe(
            data => {
                this.getProfileData();
            },
            error => console.log(error)
        );
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            const postId = 'id';
            this.id = params[postId];
            this.getProfileData();
        });

        this.usersInfo = this.userService.getUsersProfile();
        // console.log(this.usersInfo);
        this.currentUserId = localStorage.getItem('userId');
        this.currentUserName = localStorage.getItem('user');
        this.sentRequest();
        this.newRequest();
    }

    getProfileData(id?) {
        this.userService.getProfileData(this.id).subscribe(
            (data: any) => {
                this.profile = data;
                data.friends.forEach(element => {
                    if (this.currentUserId === element.friendId) {
                        this.friends = true;
                    }
                });
                this.currentProfilePicture = data.image;
                if (this.currentProfilePicture == null) {
                    this.url = 'http://localhost:3000/images/download.jpeg';
                    // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
                } else {
                    this.url = 'http://localhost:3000/images/' + this.currentProfilePicture;
                    // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + this.currentProfilePicture;
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
            senderId: this.currentUserId    // sender of friend request
        };
        this.userService.sendRequest(request).subscribe(
            data => {
                this.SOCKET.emit('friendRequest', request);
                this.friendRequestSent = true;
            },
            error => console.log(error)
        );
    }

    CancelFriendRequest(userId: string) {
        this.userService.cancelFriendRequest(this.currentUserId, userId).subscribe(
            data => {
                this.SOCKET.emit('cancelFriendRequest', this.currentUserId);
                this.acceptRequest = false;
                this.friendRequestSent = false;
                this.newRequest();
                this.sentRequest();
            },
            error => console.error(error)
        );
    }


    newRequest() {
        this.userService.RequestList(this.currentUserId).subscribe(
            (data: any) => {
                for (const i of data.pendingRequestId) {
                    this.acceptRequest = true;
                }
            },
            error => console.log(error)
        );
    }

    sentRequest() {
        this.userService.SentRequestList(this.currentUserId).subscribe(
            (data: any) => {
                data.forEach(element => {
                    if (this.id === element) {
                        this.friendRequestSent = true;
                    }
                });

            },
            error => console.log(error)
        );
    }


    AcceptFriendRequest(friendId: string, friendUserName: string) {
        this.userService.changeRequestStatus(this.currentUserId, friendId).subscribe(
            data => {
                this.SOCKET.emit('acceptFriendRequest', this.currentUserId);
                this.updateFriendList(this.currentUserId, this.currentUserName, friendId, friendUserName);
                this.updateFriendList(friendId, friendUserName, this.currentUserId, this.currentUserName);
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
            },
            error => console.log(error)
        );
    }

    DeleteFriendRequest(userId: string) {
        this.userService.deleteFriendRequest(userId, this.currentUserId).subscribe(
            data => {
                this.SOCKET.emit('cancelFriendRequest', this.currentUserId);
                this.acceptRequest = false;
                this.friendRequestSent = false;
                this.friends = false;
                this.newRequest();
                this.sentRequest();
            },
            error => console.error(error)
        );
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
