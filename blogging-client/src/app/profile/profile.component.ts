import { UserService } from './../services/user.service';
import { AuthService } from '../services/auth.service';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderPipe } from 'ngx-order-pipe';
import { HttpErrorResponse } from '@angular/common/http';
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
    getCurrentPostId: string;
    displayAddPost = false;
    showAllPost = true;
    postList: any;
    displayMyPost: any;
    showMyPost= false;
    displayComment = [];
    recentComment = [];
    newComment: any;
    incorrectPost: boolean;
    order: string;

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

    constructor(private authService: AuthService,private userService: UserService, private router: Router,private orderPipe: OrderPipe) { }

    ngOnInit() {
        this.ShowAllPost();
        this.ShowAllComments();
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
    }

    ShowAllPost() {
        this.userService.showPost().subscribe(
            (data) => {
                this.postList = Object.values(data).sort((val1, val2)=> {
                    const start = +new Date(val1.createdAt);
                    const end = +new Date(val2.createdAt)
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

    DisplayPostBox=() => this.displayAddPost = !this.displayAddPost;


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
                this.ShowAllComments();
                this.DisplayMyPost();
            },
            error => {
                this.incorrectPost = true;
                console.error(error);
            }
        );

        this.displayAddPost = false;
        this.ShowAllPost();
    }

    DisplayMyPost() {
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
        this.getCurrentPostId = id;
        this.displayComment[index] = !this.displayComment[index];
    }

    ShowAllComments() {
        this.userService.getCommentsByPostId().subscribe(
            (data: { comments: any}) => {
                this.newComment = data.comments;
            }
        );
    }

    PostComment(id: string) {
        if (!this.commentForm.valid) {
            return;
        }

        const obj = {
            postId: id,
            comment: this.commentForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addComment(obj).subscribe(
                data => {
                    this.commentForm.reset();
                    this.ShowAllPost();
                },
                error => {
                }
            )
        );
    }

    UpdatePost(postId: string){debugger
        this.userService.updatePost(postId, JSON.stringify(this.updatePost.value)).subscribe(
          data=> {
              this.DisplayMyPost();
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
