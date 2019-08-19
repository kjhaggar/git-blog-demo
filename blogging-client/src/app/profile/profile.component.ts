import { UserService } from './../services/user.service';
import { AuthService } from '../services/auth.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as io from 'socket.io-client';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FilterPipe } from 'ngx-filter-pipe';
const parse = require('parse-mentions');

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('500ms ease-in')),
            transition('out => in', animate('500ms ease-out'))
        ]),
    ]
})
export class ProfileComponent implements OnInit {
    private socket = io('http://127.0.0.1:3000');
    // private socket = io ('https://backend-blogging-appliaction.herokuapp.com');
    private subscription: Subscription = new Subscription();
    private getCurrentUserId: string;
    private displayComment = [];
    private url: any;
    private panelOpenState = [];
    private dispalyReplyBox = [];
    private commentClicked: boolean;
    private replyClicked = [];
    private visitUsersProfile = [];
    private uploadUpdatedBlogImages = [];
    private filesToUpload: Array<File> = [];
    private geoCoder;
    private mentionedUsers: Array<string>;
    public recentNotification: any;
    public menuState = 'out';
    public readNotification = true;
    public numberOfNotification = 0;
    public searchText: string;
    public friendRequestSent = [];
    public acceptRequest = [];
    public showAllPost = true;
    public postList: any;
    public displayMyPost: any;
    public incorrectPost: boolean;
    public uploadBlogImages: boolean;
    public usersProfile: any;
    public newBlogLink = 'New Blog';
    public items: any;
    public showMyFriends = false;
    public newFriendRequest: boolean;
    public newFriend: any;
    public friendsInfo: any;
    public zoom: number;
    public address: string;
    public submitted: boolean;
    public item: any;
    public searchInfo: any;
    public hideSuccessMessage: boolean;
    public newFriendAdded: boolean;
    public getTaggedByUser: string;
    public search: boolean;
    public displayOriginalBlog = [];
    public displayUpdatedBlog = [];
    public getCurrentUserName: string;
    public displayAddPost = false;
    public showMyPost = false;
    public showGoogleMap: boolean;
    public latitude: number;
    public longitude: number;

    searchForm: FormGroup = new FormGroup({
        searchInfo: new FormControl()
    });

    postForm: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        image: new FormControl(null)
    });

    updatePost: FormGroup = new FormGroup({
        description: new FormControl(null, Validators.required),
        image: new FormControl(null)
    });

    commentForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    replyForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    constructor(private authService: AuthService, private userService: UserService,
        private router: Router, private sanitized: DomSanitizer, private http: HttpClient,
        private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
        private filterPipe: FilterPipe) {
        this.userService.newCommentReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        );

        this.userService.newReplyReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        );

        this.userService.newPostReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        );

        this.userService.newRequestReceived().subscribe(
            data => {
                if (this.getCurrentUserId === data.receiverId) {
                    this.newRequest();
                }
            },
            error => console.log(error)
        );

        this.userService.newTag().subscribe(
            data => {
                if (data.users.includes(this.getCurrentUserName)) {
                    this.getTaggedByUser = data.taggedBy;
                    this.hideSuccessMessage = true;
                    this.newNotification();
                }
            },
            error => console.log(error)
        );

        this.userService.canceledRequestReceived().subscribe(
            data => {
                this.newRequest();
                this.acceptRequest[data] = false;
                this.friendRequestSent[data] = false;
            },
            error => console.log(error)
        );

    }

    ngOnInit() {
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
        this.ShowAllPost();
        this.DisplayProfile();
        this.newRequest();
        this.sentRequest();
        this.friends();
        this.tagUser();
        this.newNotification();

        this.searchInfo = {
            location: '',
        };

        this.mapsAPILoader.load().then(() => {
            // this.setCurrentLocation();
            this.geoCoder = new (google.maps.Geocoder)();
            // let autocomplete = new google.maps.places.Autocomplete(this.search, {
            //     types: ["address"]
            //   });
            //   autocomplete.addListener("place_changed", () => {
            //     this.ngZone.run(() => {
            //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
            //       if (place.geometry === undefined || place.geometry === null) {
            //         return;
            //       }
            //       this.latitude = place.geometry.location.lat();
            //       this.longitude = place.geometry.location.lng();
            //       this.zoom = 12;
            //     });
            // });
        });
    }

    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }
    searchLoc(temp) {
        this.geoCoder.geocode({ address: temp.location }, (results, status) => {
            // console.log(status);
            // if (status === 'OK') {
            //     if (results[0]) {
            //     this.zoom = 12;
            //     this.address = results[0].formatted_address;
            //     } else {
            //     window.alert('No results found');
            //     }
            // } else {
            //     window.alert('Geocoder failed due to: ' + status);
            // }

        });

    }
    getAddress(latitude, longitude) {

        this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            // console.log(results);
            // console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                // window.alert('Geocoder failed due to: ' + status);
            }

        });


    }

    get f() { return this.postForm.controls; }

    tagUser() {
        this.userService.tagUser().subscribe(
            (data: { uName: string }) => {
                this.item = data.uName;
            },
            err => console.log(err)
        );
    }

    newNotification(userTaggedBy?: string) {
        this.getTaggedByUser = userTaggedBy;
        this.userService.NotificationList(this.getCurrentUserName).subscribe(
            (data: { taggedBy: string, taggedUsers: any }) => {
                this.getTaggedByUser = data.taggedBy;
                for (const index in data) {
                    if (data.hasOwnProperty(index)) {
                        const taggedUsers = 'taggedUsers';
                        const x = data[index][taggedUsers];
                        for (const temp in x) {
                            if (x.hasOwnProperty(temp)) {
                                const userName = 'userName';
                                const read = 'read';
                                if (x[temp][userName] === this.getCurrentUserName && x[temp][read] === false) {
                                    this.hideSuccessMessage = true;
                                    this.numberOfNotification++;
                                }
                            }
                        }
                    }
                }
                this.recentNotification = data;
            },
            error => console.log(error)
        );
    }

    changeStatus() {
        this.recentNotification.forEach(element => {
            this.userService.changePostStatus(element._id, this.getCurrentUserName).subscribe(
                (data) => {
                    this.readNotification = false;
                },
                error => console.log(error)
            );
        });
    }

    UploadBlogImages(index: number) {
        this.uploadBlogImages = !this.uploadBlogImages;
        this.submitted = false;
        if (this.showMyPost) {
            this.uploadUpdatedBlogImages[index] = !this.uploadUpdatedBlogImages[index];
        }
    }

    AddPost() {
        this.submitted = true;
        if (!this.postForm.valid) {
            return;
        }

        const mentions = parse(this.postForm.value.description);
        this.mentionedUsers = mentions.matches.map(item => item.name)
            .filter((value, index, self) => self.indexOf(value) === index);

        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const name = 'name';
                formData.append('uploads[]', files[i], files[i][name]);
            }
        }
        const obj = {
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        formData.append('forminput', JSON.stringify(obj));
        this.userService.addPost(formData).subscribe(
            (data: { _id: string }) => {
                this.ShowAllPost();
                this.socket.emit('post', obj);
                this.displayAddPost = !this.displayAddPost;
                this.submitted = false;
                this.postForm.reset();
                this.newBlogLink = 'New Blog';
                this.DisplayProfile();
                const mentioned = {
                    postId: data._id,
                    users: this.mentionedUsers,
                    taggedBy: this.getCurrentUserName
                };
                this.socket.emit('tag', mentioned);
                this.userService.sendNotification(mentioned).subscribe(
                    err => console.log(err)
                );
            },
            error => {
                this.incorrectPost = true;
                console.error(error);
            }
        );
    }

    fileChangeEvent(fileInput: any) {
        // this.filesToUpload = <Array<File>> fileInput.target.files;
        this.filesToUpload = fileInput.target.files as Array<File>;
    }

    AcceptFriendRequest(friendId: string, friendUserName: string) {
        this.userService.changeRequestStatus(this.getCurrentUserId, friendId).subscribe(
            data => {
                this.updateFriendList(this.getCurrentUserId, this.getCurrentUserName, friendId, friendUserName);
                this.updateFriendList(friendId, friendUserName, this.getCurrentUserId, this.getCurrentUserName);
                this.newRequest();
                this.newFriendAdded = true;
            },
            error => console.log(error)
        );
    }

    updateFriendList(userId: string, userName: string, friendId: string, friendUserName: string) {
        this.userService.acceptFriendRequest(userId, userName, friendId, friendUserName).subscribe(
            data => {
                this.newRequest();
                this.visitUsersProfile[userId] = true;
            },
            error => console.log(error)
        );
    }

    DeleteFriendRequest(userId: string) {
        this.userService.deleteFriendRequest(userId, this.getCurrentUserId).subscribe(
            data => {
                this.socket.emit('cancelFriendRequest', this.getCurrentUserId);
                this.acceptRequest[userId] = false;
                this.friendRequestSent[userId] = false;
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
                this.acceptRequest[userId] = false;
                this.friendRequestSent[userId] = false;
                this.newRequest();
                this.sentRequest();
            },
            error => console.error(error)
        );
    }

    newRequest(userId?: string) {
        this.userService.RequestList(this.getCurrentUserId).subscribe(
            (data: { pendingUserProfile: any, pendingRequestId: any }) => {
                this.newFriendRequest = true;
                this.newFriend = data.pendingUserProfile;
                for (const i of data.pendingRequestId) {
                    this.acceptRequest[data.pendingRequestId[i]] = true;
                }
            },
            error => console.log(error)
        );
    }

    sentRequest() {
        this.userService.SentRequestList(this.getCurrentUserId).subscribe(
            (data: { pendingRequestId: string }) => {
                for (const i of data.pendingRequestId) {
                    this.friendRequestSent[data.pendingRequestId[i]] = true;
                }
            },
            error => console.log(error)
        );
    }

    friends() {
        this.userService.FriendsList(this.getCurrentUserId).subscribe(
            (data: { friendList: any }) => {
                this.friendsInfo = data.friendList;
            },
            error => {
                console.log(error);
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
                this.friendRequestSent[request.receiverId] = true;
            },
            error => console.log(error)
        );
    }

    UsersList() {
        this.displayAddPost = false;
        this.showAllPost = false;
        this.showMyPost = false;
        this.showMyFriends = true;
        this.userService.getUsersList().subscribe(
            data => {
                this.items = data;
            },
            error => console.log(error)
        );
    }

    Notify() {
        this.menuState = this.menuState === 'out' ? 'in' : 'out';
        this.changeStatus();
    }

    clickedHome() {
        this.showAllPost = true;
        this.displayAddPost = false;
        this.newBlogLink = 'New Blog';
        this.showMyPost = false;
        this.showMyFriends = false;
    }
    clickedMyPost() {
        this.panelOpenState = [];
        this.postForm.reset();
        this.submitted = false;
        this.uploadBlogImages = false;
        this.showMyFriends = false;
        this.displayAddPost = !this.displayAddPost;
        this.newBlogLink = 'New Blog';
        this.displayAddPost = false;
        this.showAllPost = false;
        this.showMyPost = true;
        this.displayComment = [];
        this.dispalyReplyBox = [];
        this.replyClicked = [];
        this.commentClicked = false;
        this.DisplayMyPost();
    }

    DisplayMyPost() {
        this.userService.getPostById(this.getCurrentUserId).subscribe(
            (data) => {
                this.displayMyPost = Object.values(data).sort((val1, val2) => {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt);
                    return end - start;
                });
            }
        );
    }

    openCommentForm() {
        this.commentClicked = !this.commentClicked;
    }

    openReplyForm(index) {
        this.replyClicked[index] = !this.replyClicked[index];
    }

    openReplyText(index: number) {
        this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    }

    addReply(postId: string, commentId: string, index: number, blogIndex: number) {
        this.panelOpenState[blogIndex] = true;
        if (!this.replyForm.valid) {
            return;
        }

        const obj = {
            postId,
            commentId,
            content: this.replyForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addReply(obj).subscribe(
                data => {
                    this.replyClicked[index] = !this.replyClicked[index];
                    this.socket.emit('reply', obj);
                    this.replyForm.reset();
                    this.ShowAllPost();

                    if (this.showMyPost) {
                        this.DisplayMyPost();
                    }
                },
                error => {
                }
            )
        );
    }

    DisplayProfile() {
        this.userService.displayProfile().subscribe(
            (data: { user: object }) => {
                this.usersProfile = data.user;
            },
            err => {
                console.log(err);
            }
        );
    }
    ShowAllPost() {
        this.userService.showPost().subscribe(
            (data) => {
                this.postList = Object.values(data).sort((val1, val2) => {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt);
                    return end - start;
                });

            },
            error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        this.router.navigate(['/login']);
                    }
                }
            }
        );
    }

    DisplayPostBox = () => {
        this.displayAddPost = !this.displayAddPost;
        this.newBlogLink = '';
        this.panelOpenState = [];
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

    GetBlogImageUrl(filename) {
        this.url = 'http://localhost:3000/blogImages/' + filename;
        // this.url = 'https://backend-blogging-appliaction.herokuapp.com/blogImages/' + filename;
        return this.sanitized.bypassSecurityTrustUrl(this.url);
    }

    ShowCommentBox(id: string, index: number) {
        this.displayComment[index] = !this.displayComment[index];
        this.dispalyReplyBox = [];
        this.replyClicked = [];
    }

    DeletePost(postId) {
        this.userService.deletePost(postId).subscribe(
            data => {
                this.DisplayMyPost();
                this.ShowAllPost();
            },
            error => console.error(error)
        );
    }

    FadeOutSuccessMsg() {
        setTimeout(() => {
            // this.hideSuccessMessage = false;
            this.newFriendAdded = false;
            this.menuState = 'out';
        }, 4000);
    }
    Logout = () => this.authService.logout();

}
