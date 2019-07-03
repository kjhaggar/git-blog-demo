import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
    displayAddPost: boolean;
    showAllPost = true;
    postList: any;
    displayMyPost: any;
    showMyPost: boolean;
    displayComment = [];
    recentComment = [];
    newComment: any;

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

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() {
        this.ShowAllPost();
        this.ShowAllComments();
        this.getCurrentUserId = this.userService.currentUserId;
        this.getCurrentUserName = this.userService.currentUserName;
    }

    ShowAllPost() {
        this.userService.showPost().subscribe(
            (data) => {
                this.postList = data;
            }
        );
    }

    DisplayPostBox() {
        if (this.displayAddPost === false) {
            this.displayAddPost = true;
        } else {
            this.displayAddPost = false;
        }
    }

    AddPost() {
        if (!this.postForm.valid) {
            console.log('error in submiting');
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
            },
            error => {
                alert('Error in posting your blog..!!');
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
                this.displayMyPost = data;
                console.log(this.displayMyPost);
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
            alert( 'Invalid Comment');
            console.log('Invalid Comment');
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
                    console.log(data);
                    this.commentForm.reset();
                    this.ShowAllPost();
                },
                error => {
                    alert('Error in posting your blog..!!');
                    console.error(error);
                }
            )
        );
    }

    Logout() {
        this.router.navigate(['/login']);
}
}
