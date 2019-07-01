import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_form:FormGroup = new FormGroup({
    userName:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required)
  })

  constructor(private userService: UserService,private router :Router,private route: ActivatedRoute) { }

  ngOnInit() {
  }

  Login(){
    if(!this.login_form.valid){
      console.log('Invalid UserName/Password');return;
    }

    this.userService.login(JSON.stringify(this.login_form.value))
    .subscribe(
      data=>{
        console.log(data);
        this.userService.currentUserId = data["userId"];
        this.userService.currentUserName = data["userName"];
        this.router.navigate(['/profile']);

        localStorage.setItem('currentUser', JSON.stringify(this.login_form.value));
        console.log(localStorage.getItem('currentUser'));
      },
      error=>{ alert("Incorrect username/password...!!");
        console.error(error)}
    )
  }
}
