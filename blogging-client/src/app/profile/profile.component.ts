import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private socket = io('http://127.0.0.1:3000');
    // private socket = io ('https://backend-blogging-appliaction.herokuapp.com');
    private subscription: Subscription = new Subscription();
    public getCurrentUserId: string;
    private displayComment = [];
    private url: any;
    private panelOpenState = [];
    private dispalyReplyBox = [];
    private commentClicked: boolean;
    private replyClicked = [];
    private uploadUpdatedBlogImages = [];


    public showAllPost = true;
    public postList: any;
    public incorrectPost: boolean;
    public uploadBlogImages: boolean;
    public showMyFriends = false;
    public submitted: boolean;
    public item: any;

    public search: boolean;
    public displayOriginalBlog = [];
    public displayUpdatedBlog = [];
    public getCurrentUserName: string;
    public displayAddPost = false;
    public showMyPost = false;
    public sizeOfAllPost: number;

    public usersProfile: any;

    searchForm: FormGroup = new FormGroup({
        searchInfo: new FormControl()
    });

    commentForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    replyForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    constructor(private userService: UserService, private router: Router,
        private sanitized: DomSanitizer) {
        this.userService.newCommentReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    // this.DisplayMyPost();
                }
            }
        );

        this.userService.newReplyReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    // this.DisplayMyPost();
                }
            }
        );

        this.userService.newPostReceived().subscribe(
            data => {
                this.ShowAllPost();
                if (this.showMyPost) {
                    // this.DisplayMyPost();
                }
            }
        );

        // this.userService.newTag().subscribe(
        //   data => {
        //     if (data.users.includes(this.getCurrentUserName)) {
        //       this.getTaggedByUser = data.taggedBy;
        //       this.hideSuccessMessage = true;
        //       this.newNotification();
        //     }
        //   },
        //   error => console.log(error)
        // );

    }

    ngOnInit() {
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
        this.ShowAllPost();
        this.DisplayProfile();
    }

    DisplayProfile() {
        this.userService.displayProfile().subscribe(
            data => {
                this.usersProfile = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    UploadBlogImages(index: number) {
        this.uploadBlogImages = !this.uploadBlogImages;
        this.submitted = false;
        if (this.showMyPost) {
            this.uploadUpdatedBlogImages[index] = !this.uploadUpdatedBlogImages[index];
        }
    }

    modifyvalue(item) {
        return '<b>' + item.label + '</b>';
    }

    clickedHome() {
        this.showAllPost = true;
        this.displayAddPost = false;
        this.showMyPost = false;
        this.showMyFriends = false;
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
                        // this.DisplayMyPost();
                    }
                },
                error => {
                }
            )
        );
    }

    ShowAllPost() {
        this.userService.showPost().subscribe(
            data => {
                this.postList = Object.values(data).sort((val1, val2) => {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt);
                    return end - start;
                });
                this.sizeOfAllPost = Object.keys(this.postList).length;
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
                // this.DisplayMyPost();
                this.ShowAllPost();
            },
            error => console.error(error)
        );
    }

}
