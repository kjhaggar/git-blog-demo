import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
	id: string;
	private sub: any;
	post: Object;
	url: any;
	toggleCommentButton = "Show Comments"
	displayComment: boolean;
	dispalyReplyBox = [];
	replyClicked = [];
	commentClicked: boolean;
	getCurrentUserId: string;
	getCurrentUserName: string;
	private subscription: Subscription = new Subscription();
	private socket = io('http://127.0.0.1:3000');

	commentForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
	});
	
	replyForm: FormGroup = new FormGroup({
        content: new FormControl(null, Validators.required)
	});
	
	constructor(private route: ActivatedRoute, private userService: UserService,
		private sanitized: DomSanitizer) { }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
		this.id = params['id'];
	});
	this.getCurrentUserId = localStorage.getItem('userId');
    this.getCurrentUserName = localStorage.getItem('user');
	this.getBlog();
	}

	getBlog() {
		this.userService.getBlogById(this.id).subscribe(
			data => {
				this.post = data;
			},
			error => console.log(error)
		)
	}

	GetBlogImageUrl(filename){
        this.url = 'http://localhost:3000/blogImages/' + filename;
        return this.sanitized.bypassSecurityTrustUrl(this.url);
	}

	ShowCommentBox() {
		this.displayComment= !this.displayComment;
		this.commentClicked = false;
		if(this.displayComment) {
			this.toggleCommentButton = "Close Comments"
		} else {
			this.toggleCommentButton = "Show Comments"
		}
        this.dispalyReplyBox = [];
        this.replyClicked = [];
    } 
	
	openCommentForm() {
        this.commentClicked = !this.commentClicked;
	}
	
	PostComment(postId: string, index: number) {

        const obj = {
            postId: postId,
            comment: this.commentForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addComment(obj).subscribe(
                data => {
                    this.socket.emit('tag',obj);
                    this.commentClicked = false;
                    this.socket.emit('comment',obj); 
					this.commentForm.reset();
					this.getBlog();
                },
                error => {
                }
            )
        );
	}
	openReplyText(index: number){
        this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    }
	
	openReplyForm(index) {
        this.replyClicked[index] = !this.replyClicked[index];
	}
	
	addReply(postId: string, commentId: string, index: number,blogIndex: number) {
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
                    this.getBlog()
                },
                error => {
                }
            )
        );
	}
	
	ngOnDestroy() {
		this.sub.unsubscribe();
	  }

}
