import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-myblog',
    templateUrl: './myblog.component.html',
    styleUrls: ['./myblog.component.css']
})
export class MyblogComponent implements OnInit {
    id: string;
    private sub: any;
    post: object;
    url: any;
    toggleCommentButton = 'Show Comments';
    displayComment: boolean;
    dispalyReplyBox = [];
    replyClicked = [];
    commentClicked: boolean;
    getCurrentUserId: string;
    getCurrentUserName: string;
    private subscription: Subscription = new Subscription();
    private socket = io('http://127.0.0.1:3000');
    // private socket = io ('https://backend-blogging-appliaction.herokuapp.com');
    usersProfile: any;
    displayOriginalBlog: boolean;
    displayUpdatedBlog: boolean;
    filesToUpload: Array<File> = [];
    uploadUpdatedBlogImages: boolean;
    submitted: boolean;
    public showEmojiPicker = false;
    public showReplyEmojiPicker = [];

    commentForm: FormGroup = new FormGroup({
        content: new FormControl('', Validators.required)
    });

    replyForm: FormGroup = new FormGroup({
        content: new FormControl('', Validators.required)
    });

    updatePost: FormGroup = new FormGroup({
        description: new FormControl(null, Validators.required),
        image: new FormControl(null)
    });

    constructor(private route: ActivatedRoute, private userService: UserService, private sanitized: DomSanitizer) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            const id = 'id';
            this.id = params[id];
        });
        this.getCurrentUserId = localStorage.getItem('userId');
        this.getCurrentUserName = localStorage.getItem('user');
        this.getBlog();
        this.DisplayProfilePicture();
    }

    toggleEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
    }

    addEmoji(event) {
        const text = `${this.commentForm.controls.content.value}${event.emoji.native}`;
        this.commentForm.get('content').setValue(text);
        this.showEmojiPicker = false;
    }

    toggleReplyEmojiPicker(index: number) {
        this.showReplyEmojiPicker[index] = !this.showReplyEmojiPicker[index];
    }

    addReplyEmoji(event, index: number, value: string) {
        const text = `${value} ${event.emoji.native}`;
        this.replyForm.get('content').setValue(text);
        this.showReplyEmojiPicker[index] = false;
    }

    DisplayProfilePicture() {
        this.userService.displayProfile().subscribe(
            (data: { user: object }) => {
                this.usersProfile = data.user;
            },
            err => {
                console.log(err);
            }
        );
    }

    getBlog() {
        this.userService.getBlogById(this.id).subscribe(
            data => {
                this.post = data;
            },
            error => console.log(error)
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

    GetBlogImageUrl(filename) {
        this.url = 'http://localhost:3000/blogImages/' + filename;
        // this.url = 'https://backend-blogging-appliaction.herokuapp.com/blogImages/' + filename;
        return this.sanitized.bypassSecurityTrustUrl(this.url);
    }

    ShowCommentBox() {
        this.displayComment = !this.displayComment;
        this.commentClicked = false;
        if (this.displayComment) {
            this.toggleCommentButton = 'Close Comments';
        } else {
            this.toggleCommentButton = 'Show Comments';
        }
        this.dispalyReplyBox = [];
        this.replyClicked = [];
    }

    openCommentForm() {
        this.commentClicked = !this.commentClicked;
    }

    PostComment(postId: string, index: number) {

        const obj = {
            postId,
            comment: this.commentForm.value.content,
            userId: this.getCurrentUserId,
            userName: this.getCurrentUserName
        };

        this.subscription.add(
            this.userService.addComment(obj).subscribe(
                data => {
                    this.socket.emit('tag', obj);
                    this.commentClicked = false;
                    this.socket.emit('comment', obj);
                    this.commentForm.reset();
                    this.getBlog();
                },
                error => {
                }
            )
        );
    }
    openReplyText(index: number) {
        this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    }

    openReplyForm(index) {
        this.replyClicked = [];
        this.replyClicked[index] = !this.replyClicked[index];
    }

    addReply(postId: string, commentId: string, index: number, blogIndex: number) {
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
                    this.getBlog();
                },
                error => {
                }
            )
        );
    }

    DeletePost(postId: string) {
        this.userService.deletePost(postId).subscribe(
            data => {
                this.getBlog();
            },
            error => console.error(error)
        );
        alert('Blog no longer available.. \n Go back to Home Page');
    }

    deleteBlogImage(imageId: string) {
      this.userService.deleteBlogImage(imageId, this.id).subscribe(
        (data) => {
            this.getBlog();
        },
        error => console.error(error)
    );
    }

    deleteComment(commentId: string) {
      this.userService.deleteComment(commentId, this.id).subscribe(
        (data) => {
            this.getBlog();
        },
        error => console.error(error)
    );
    }

    deleteReply(replyId: string, commentId: string) {
      this.userService.deleteReply(replyId, commentId, this.id).subscribe(
        (data) => {
            this.getBlog();
        },
        error => console.error(error)
    );
    }

    UpdatePost(postId: string) {
        this.displayOriginalBlog = !this.displayOriginalBlog;
        this.displayUpdatedBlog = !this.displayUpdatedBlog;
        const formData: any = new FormData();
        if (this.displayUpdatedBlog) {
            this.filesToUpload = [];
        }
        const files: Array<File> = this.filesToUpload;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const name = 'name';
                formData.append('uploads[]', files[i], files[i][name]);
            }
        }
        formData.append('forminput', JSON.stringify(this.updatePost.value.description));
        if (!this.updatePost.valid) {
            return;
        }
        this.userService.updatePost(postId, formData).subscribe(
            data => {
                this.uploadUpdatedBlogImages = false;
                this.getBlog();
            },
            error => console.error(error)
        );
    }

    UploadBlogImages() {
        this.submitted = false;
        this.uploadUpdatedBlogImages = !this.uploadUpdatedBlogImages;
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = fileInput.target.files as Array<File>;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
