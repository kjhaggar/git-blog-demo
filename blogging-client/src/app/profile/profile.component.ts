import { UserService } from './../services/user.service';
import { AuthService } from '../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import * as io from 'socket.io-client';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    private socket = io('http://127.0.0.1:3000');
    private subscription: Subscription = new Subscription();
    getCurrentUserId: string;
    getCurrentUserName: string;
    displayAddPost = false;
    showAllPost = true;
    postList: any;
    displayMyPost: any;
    showMyPost= false;
    displayComment = [];
    incorrectPost: boolean;
    usersProfile: any;
    url: any;
    labelName : string = 'My Blogs';
    panelOpenState = [];
    newBlogLink = 'New Blog';
    displayOriginalBlog = [];
    displayUpdatedBlog = [];
    dispalyReplyBox = [];
    commentClicked: boolean;
    replyClicked= [];
    usersInfo: any;
    showMyFriends = false;
    newFriendRequest: boolean;
    newFriend: any;
    acceptRequest = [];
    friendRequestSent = [];
    latitude: number;
    longitude: number;
    zoom:number;
    address: string;
    uploadBlogImages: boolean;
    uploadUpdatedBlogImages = [];
    filesToUpload: Array<File> = [];
    submitted: boolean;
  
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
        private router: Router, private sanitized: DomSanitizer,private http: HttpClient) {
        this.userService.newCommentReceived().subscribe(
            data => { 
                this.ShowAllPost();
                if(this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        )

        this.userService.newReplyReceived().subscribe(
            data => { 
                this.ShowAllPost();
                if(this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        )

        this.userService.newPostReceived().subscribe(
            data => { 
                this.ShowAllPost();
                if(this.showMyPost) {
                    this.DisplayMyPost();
                }
            }
        )

        this.userService.newRequestReceived().subscribe(
            data => {
                if(this.getCurrentUserId == data.receiverId) {
                    this.newRequest();
                }
            },
            error => console.log(error)
        )

    }

    ngOnInit() {
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
        this.setCurrentLocation();
        this.ShowAllPost();
        this.DisplayProfile();
        this.newRequest();
        this.sentRequest();
    }
    private setCurrentLocation() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 15;
          });
        }
      }

    get f() { return this.postForm.controls; }

    UploadBlogImages(index: number){
        this.uploadBlogImages = !this.uploadBlogImages;
        this.submitted = false;
        if(this.showMyPost) {
            this.uploadUpdatedBlogImages[index] = !this.uploadUpdatedBlogImages[index];
        }
    }

    AddPost() {
        this.submitted = true;
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        if(files.length > 0) {
            for(let i =0; i < files.length; i++){
                formData.append("uploads[]", files[i], files[i]['name']);
            }
        }
        if (!this.postForm.valid) {
            return;
        }
        const obj = {
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        formData.append("forminput", JSON.stringify(obj));
        this.userService.addPost( formData ).subscribe(
            data => {
                this.socket.emit('post',obj);
                this.displayAddPost = !this.displayAddPost;
                this.submitted = false;
                this.postForm.reset();
                this.newBlogLink = 'New Blog';
                this.ShowAllPost();
                this.DisplayProfile();
            },
            error => {
                this.incorrectPost = true;
                console.error(error);
            }
        );
    }

    UpdatePost(postId: string,index: number){
        this.panelOpenState[index] = true;
        this.displayOriginalBlog[index] = !this.displayOriginalBlog[index] ;
        this.displayUpdatedBlog[index]= !this.displayUpdatedBlog[index];
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        if(files.length > 0) {
            for(let i =0; i < files.length; i++){
                formData.append("uploads[]", files[i], files[i]['name']);
            }
        }
        formData.append("forminput", JSON.stringify(this.updatePost.value.description));
        if (!this.updatePost.valid) {
            return;
        }
        this.userService.updatePost(postId, formData).subscribe(
          data=> {
              this.uploadUpdatedBlogImages[index] = false;
              this.ShowAllPost();
              this.DisplayMyPost();
            },
            error=>console.error(error)
        )
    }

    fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    
    DeleteFriendRequest(userId: string) {debugger
        this.userService.deleteFriendRequest(userId, this.getCurrentUserId).subscribe(
            data=> {
                this.newRequest();
                this.sentRequest();
              },
              error=>console.error(error)
          )
    }

    newRequest() {
        this.userService.RequestList(this.getCurrentUserId).subscribe(
            (data: {pendingUserProfile: any, pendingRequestId: any}) => {
                this.newFriendRequest = true;
                this.newFriend = data.pendingUserProfile;
                for(var i =0; i< data.pendingRequestId.length; i++) {
                    this.acceptRequest[data.pendingRequestId[i]] = true;
                }
            },
            error => console.log(error)
        )
    }

    sentRequest() {
        this.userService.SentRequestList(this.getCurrentUserId).subscribe(
            (data: {pendingRequestId : string}) => {
                for( var i=0; i< data.pendingRequestId.length;i++) {
                    this.friendRequestSent[data.pendingRequestId[i]] = true;
                }
            },
            error => console.log(error)
        )
    }

    sendRequest(receiverId: string) {
        var request = {
            receiverId: receiverId,            // receiver of friend request
            senderId: this.getCurrentUserId    // sender of friend request
        }
        this.userService.sendRequest(request).subscribe(
            data => {
                this.socket.emit('friendRequest',request);
                this.friendRequestSent[request.receiverId] = true;
            },
            error => console.log(error)
        )
    }

    UsersList() {
        this.displayAddPost = false;
        this.showAllPost = false;
        this.showMyPost = false;
        this.showMyFriends = true;
        this.userService.getUsersList().subscribe(
            data => {
                this.usersInfo = data;
            },
            error => console.log(error)
        )
    }

    clickedMyPost() {
        this.postForm.reset();
        this.submitted = false;
        this.uploadBlogImages = false
        this.showMyFriends = false;
        this.displayAddPost = !this.displayAddPost;
        this.newBlogLink = "New Blog";
        if(this.showMyPost == true) {
            this.labelName = "My Blogs";
        } else {
            this.labelName = "Dashboard";
        }
        this.displayAddPost = false;
        this.showAllPost = !this.showAllPost;
        this.showMyPost = !this.showMyPost;
        this.displayComment = [];
        this.dispalyReplyBox = [];
        this.replyClicked = [];
        this.commentClicked = false;
        this.DisplayMyPost();
    }

    DisplayMyPost() {
        this.userService.getPostById(this.getCurrentUserId).subscribe(
            (data) => {
                this.displayMyPost = Object.values(data).sort((val1, val2)=> {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt)
                    return end - start;
        })
            }
        );
    }

    openCommentForm() {
        this.commentClicked = !this.commentClicked;
    }

    openReplyForm(index) {
        this.replyClicked[index] = !this.replyClicked[index];
    }

    PostComment(postId: string, index: number) {
        if(this.panelOpenState[index] == false) { 
            this.panelOpenState[index] =  !this.panelOpenState[index];
        } 
            this.panelOpenState[index] = true;
        if (!this.commentForm.valid) {
            return;
        }

        const obj = {
            postId: postId,
            comment: this.commentForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addComment(obj).subscribe(
                data => {
                    this.commentClicked = false;
                    this.socket.emit('comment',obj); 
                    this.commentForm.reset();
                    if(this.showMyPost == true) {
                        this.DisplayMyPost();
                    } else {
                    this.ShowAllPost();
                    }
                },
                error => {
                }
            )
        );
    }
    openReplyText(index: number){
        this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    }

    addReply(postId: string, commentId: string, index: number,blogIndex: number) {
        this.panelOpenState[blogIndex] = true;
        if (!this.replyForm.valid) {
            return;
        }

        const obj = {
            postId: postId,
            commentId: commentId,
            content: this.replyForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addReply(obj).subscribe(
                data => {
                    this.replyClicked[index] = !this.replyClicked[index];
                    this.socket.emit('reply',obj);
                    this.replyForm.reset();
                    this.ShowAllPost();

                    if(this.showMyPost) {
                        this.DisplayMyPost();
                    }
                },
                error => {
                }
            )
        );
    }

    DisplayProfile(){
        this.userService.displayProfile().subscribe(
            (data:{user: Object})=> {
                this.usersProfile = data.user;
                },
            err => {
                console.log(err)}
        )
    }
    ShowAllPost() {
        this.userService.showPost().subscribe(
            (data) => {
                this.postList = Object.values(data).sort((val1, val2)=> {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt);
                    return end - start;
                })
                
            },
            error => {
                if(error instanceof HttpErrorResponse){
                    if(error.status == 401){
                        this.router.navigate(['/login']);
                    }
                }
            }
        );
    }

    DisplayPostBox=() => {
        this.displayAddPost = !this.displayAddPost;
        this.newBlogLink = "";
        this.panelOpenState =[];
    }

    GetImageUrl(filename){
        if(filename == undefined){
            this.url = 'http://localhost:3000/images/download.jpeg';
        } else {
            this.url = 'http://localhost:3000/images/' + filename;
        }
        return this.sanitized.bypassSecurityTrustUrl(this.url);
    }

    GetBlogImageUrl(filename){
        this.url = 'http://localhost:3000/blogImages/' + filename;
        return this.sanitized.bypassSecurityTrustUrl(this.url);
    }

    ShowCommentBox(id: string, index: number) {
        this.displayComment[index] = !this.displayComment[index];
        this.dispalyReplyBox = [];
        this.replyClicked = [];
    }

    DeletePost(postId){
        this.userService.deletePost(postId).subscribe(
          data=> {
              this.DisplayMyPost();
              this.ShowAllPost();
            },
            error=>console.error(error)
        )
    }

    Logout=() => this.authService.logout();
}
