import { UserService } from './../services/user.service';
import { AuthService } from '../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { debug } from 'util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    private subscription: Subscription = new Subscription();
    getCurrentUserId: string;
    getCurrentUserName: string;
    displayAddPost = false;
    showAllPost = true;
    postList: any;
    displayMyPost: any;
    showMyPost= false;
    displayComment = [];
    newComment: any;
    incorrectPost: boolean;
    order: string;
    usersProfile: any;
    url: any;
    labelName : string = 'My Blogs';
    panelOpenState = [];
    buttonName= 'Show Comments';
    newBlogLink = 'New BLog';
    displayOriginalBlog = [];
    displayUpdatedBlog = [];
    dispalyReplyBox = [];
    
    postForm: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required)
    });

    updatePost: FormGroup = new FormGroup({
        description: new FormControl(null, Validators.required)
    });

    commentForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    replyForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
    });

    constructor(private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private sanitized: DomSanitizer) {}

    ngOnInit() {
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
        this.ShowAllPost();
        this.DisplayProfile();
    }

    openReplyText(index: number){
        this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    }

    addReply(postId: string, commentId: string, index: number,blogIndex: number) {
        this.dispalyReplyBox[index] = true;
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
            (data)=> {
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
    }

    GetImageUrl(filename){
        if(filename == undefined){
            this.url = 'http://localhost:3000/images/download.jpeg';
        } else {
            this.url = 'http://localhost:3000/images/' + filename;
        }
        return this.sanitized.bypassSecurityTrustUrl(this.url);
    }


    AddPost() {
        if (!this.postForm.valid) {
            this.incorrectPost = true;
            return;
        }
        const obj = {
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.userService.addPost( JSON.stringify(obj)).subscribe(
            data => {
                this.DisplayProfile();
            },
            error => {
                this.incorrectPost = true;
                console.error(error);
            }
        );

        this.postForm.reset();
        this.displayAddPost = !this.displayAddPost;
        this.ShowAllPost();
        this.newBlogLink = 'New Blog';
    }

    DisplayMyPost() {
        if(this.showMyPost == true) {
            this.labelName = "My Blogs";
        } else {
            this.labelName = "Dashboard";
        }
        this.displayAddPost = false;
        this.showAllPost = !this.showAllPost;
        this.showMyPost = !this.showMyPost;
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

    ShowCommentBox(id: string, index: number) {
        this.displayComment[index] = !this.displayComment[index];
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
                    this.commentForm.reset();
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

    UpdatePost(postId: string,index: number){

        this.displayOriginalBlog[index] = !this.displayOriginalBlog[index] ;
        this.displayUpdatedBlog[index]= !this.displayUpdatedBlog[index];
        this.userService.updatePost(postId, JSON.stringify(this.updatePost.value)).subscribe(
          data=> {
              this.ShowAllPost();
            },
            error=>console.error(error)
        )
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
