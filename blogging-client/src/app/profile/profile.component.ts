import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  getCurrentUserId;
  getCurrentUserName;
  getCurrentPostId;
  displayAddPost: boolean = false;
  showAllPost = true;
  post_list: any;
  displayMyPost : any;
  commentList: any;
  showMyPost: boolean;
  displayComment = [];

  postForm:FormGroup = new FormGroup({
    title:new FormControl(null,Validators.required),
    description:new FormControl(null,Validators.required)
  })

  updatePost:FormGroup = new FormGroup({
    description:new FormControl(null,Validators.required)
  })

  commentForm:FormGroup = new FormGroup({
    content:new FormControl(null,Validators.required)
  })

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.ShowAllPost();
    this.getCurrentUserId = this.userService.currentUserId;
    this.getCurrentUserName = this.userService.currentUserName;
  }

  ShowAllPost(){
    this.userService.showPost().subscribe(
      (data) => {this.post_list = data},
       error=>console.error(error)
    );
  }

  DisplayPostBox(){
    if(this.displayAddPost == false)
    this.displayAddPost = true;
    else
    this.displayAddPost = false;

  }

  AddPost()
  {
    if(!this.postForm.valid){
      console.log('error in submiting');return;
    }
    
    var obj ={
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      userId: this.getCurrentUserId,
      userName: this.getCurrentUserName
    };

    this.userService.addPost( JSON.stringify(obj))
    .subscribe(
      data=>{
        console.log(data);
      },
      error=>{ alert("Error in posting your blog..!!");
        console.error(error)}
    )

    this.displayAddPost = false;
    this.ShowAllPost();
  }

  DisplayMyPost(){
    debugger
    if(this.showAllPost == true)
    this.showAllPost = false;
    else
    this.showAllPost = true;

    this.showMyPost = true;

    this.userService.getPostById(this.getCurrentUserId).subscribe(
      (data) => {
        debugger
        this.displayMyPost = data;
        console.log(this.displayMyPost);
      },
       error=>console.error(error)
    );
  }

  showCommentBox(post,index){debugger
    this.getCurrentPostId = post._id;
    this.displayComment[index] = true;
    this.ShowAllComments(post._id);
  }

  ShowAllComments(postId){
    debugger
    this.userService.getCommentsByPostId(postId).subscribe(
      (data) => {
        debugger
        this.commentList = data
      },
       error=>console.error(error)
    );
  }
  sendMessage(){debugger

    if(!this.commentForm.valid){
      alert( "Invalid Comment");
      console.log('Invalid Comment');return;
    }
    
    var obj ={
      postId: this.getCurrentPostId,
      userId: this.getCurrentUserId,
      userName: this.getCurrentUserName,
      content: this.commentForm.value.content
    };

    this.userService.addComment( JSON.stringify(obj))
    .subscribe(
      data=>{
        console.log(data);
      },
      error=>{ alert("Error in posting your blog..!!");
        console.error(error)}
    )
    this.ShowAllComments(this.getCurrentPostId);
  }
  
}
