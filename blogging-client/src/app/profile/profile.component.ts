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

  displayAddPost: boolean = false;
  post_list: any;
  di

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
  }

  ShowAllPost(){
    this.userService.showPost().subscribe(
      (data) => (this.post_list = data),
       error=>console.error(error)
    );
  }

  DisplayPost(){
    this.displayAddPost = true;
  }

  AddPost()
  { 
    if(!this.postForm.valid){
      console.log('error in submiting');return;
    }

    this.userService.addPost(JSON.stringify(this.postForm.value))
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
  
}
