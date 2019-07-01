import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  getCurrentUserId;
  getCurrentUserName;
  displayAddPost: boolean = false;
  showAllPost = true;
  post_list: any;
  displayMyPost : any;
  showMyPost: boolean;
  displayComment: boolean;

  postForm:FormGroup = new FormGroup({
    title:new FormControl(null,Validators.required),
    description:new FormControl(null,Validators.required)
  })

  updatePost:FormGroup = new FormGroup({
    description:new FormControl(null,Validators.required)
  })

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.ShowAllPost();
    this.getCurrentUserId = this.userService.currentUserId;
    this.getCurrentUserName = this.userService.currentUserName;
  }

  ShowAllPost(){
    this.userService.showPost().subscribe(
      (data) => (this.post_list = data),
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
  { debugger
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

  showCommentBox(){
    this.displayComment = true;
  }
  
}
