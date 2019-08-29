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
    public getCurrentUserId: string;
    private url: any;
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

        this.userService.newPostReceived().subscribe(
            data => {
                this.ShowAllPost();
            }
        );

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
}
