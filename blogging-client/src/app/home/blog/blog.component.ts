import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
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
    private id: string;
  private sub: any;
  private url: any;
  public displayComment: boolean;
  public dispalyReplyBox = [];
  public replyClicked = [];
  public commentClicked: boolean;
  public getCurrentUserId: string;
  public getCurrentUserName: string;
  private subscription: Subscription = new Subscription();
  private socket = io('http://127.0.0.1:3000');
  // private socket = io('https://backend-blogging-appliaction.herokuapp.com');
  private displayOriginalBlog = [];
  private displayUpdatedBlog = [];
  private filesToUpload: Array<File> = [];
  private uploadUpdatedBlogImages = [];
  public usersProfile: any;
  public toggleCommentButton = 'Show Comments';
  public post: object;
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

  constructor(private route: ActivatedRoute, private userService: UserService,
    private sanitized: DomSanitizer, private fb: FormBuilder) {

    this.userService.newCommentReceived().subscribe(
      data => {
        this.getBlog();
      }
    );

    this.userService.newReplyReceived().subscribe(
      data => {
        this.getBlog();
      }
    );
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const postId = 'id';
      this.id = params[postId];
    });
    this.getCurrentUserId = localStorage.getItem('userId');
    this.getCurrentUserName = localStorage.getItem('user');
    this.getBlog();
    this.DisplayProfilePicture();

  }

  get createItem(): FormGroup {
    return this.fb.group({
      content: ['', Validators.required]
    });
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

  DisplayProfilePicture = () => {
    this.userService.displayProfile().subscribe(
      data => {
        this.usersProfile = data;
      },
      err => {
        console.log(err);
      }
    );
  }
  getBlog = () => {
    this.userService.getBlogById(this.id).subscribe(
      data => {

        this.post = data;
      },
      error => console.log(error)
    );
  }

  GetImageUrl = (filename: string) => {
    if (filename === undefined) {
      this.url = 'http://localhost:3000/images/download.jpeg';
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
    } else {
      this.url = 'http://localhost:3000/images/' + filename;
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + filename;
    }
    return this.sanitized.bypassSecurityTrustUrl(this.url);
  }

  GetBlogImageUrl = (filename: string) => {
    this.url = 'http://localhost:3000/blogImages/' + filename;
    // this.url = 'https://backend-blogging-appliaction.herokuapp.com/blogImages/' + filename;
    return this.sanitized.bypassSecurityTrustUrl(this.url);
  }

  ShowCommentBox = () => {
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

  openCommentForm = () => {
    this.commentClicked = !this.commentClicked;
  }

  PostComment = (postId: string) => {
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
        }
      )
    );
  }

  deleteComment(commentId: string) {
    this.userService.deleteComment(commentId, this.id).subscribe(
      data => {
        this.socket.emit('delete comment', commentId);
        this.getBlog();
      },
      error => console.error(error)
    );
  }

  deleteReply(replyId: string, commentId: string) {
    this.userService.deleteReply(replyId, commentId, this.id).subscribe(
      data => {
        this.getBlog();
      },
      error => console.error(error)
    );
  }

  openReplyText = (index: number) => {
    this.dispalyReplyBox[index] = !this.dispalyReplyBox[index];
    this.replyClicked[index] = false;
  }

  openReplyForm = (index) => {
    this.replyClicked = [];
    this.replyClicked[index] = !this.replyClicked[index];
    this.replyForm.reset();
  }

  addReply = (postId: string, commentId: string, index: number) => {
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

  DeletePost = (postId) => {
    this.userService.deletePost(postId).subscribe(
      data => {
        this.getBlog();
      },
      error => {
        console.error(error);
      }
    );
    alert('Blog no longer available.. \n Go back to Home Page');
  }

  UpdatePost = (postId: string, index: number) => {
    this.displayOriginalBlog[index] = !this.displayOriginalBlog[index];
    this.displayUpdatedBlog[index] = !this.displayUpdatedBlog[index];
    const formData: any = new FormData();
    if (this.displayUpdatedBlog[index]) {
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
        this.uploadUpdatedBlogImages[index] = false;
        this.getBlog();
      },
      error => console.error(error)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
