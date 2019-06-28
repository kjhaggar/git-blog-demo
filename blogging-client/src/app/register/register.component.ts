import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  regiForm:FormGroup = new FormGroup({
    email:new FormControl(null,[Validators.email,Validators.required]),
    userName:new FormControl(null,Validators.required),
    firstName:new FormControl(null,Validators.required),
    lastName:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required),
    confirmPassword:new FormControl(null,Validators.required)
  })
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
  }

  Register() {
    if(!this.regiForm.valid || (this.regiForm.controls.password.value != this.regiForm.controls.confirmPassword.value)){
      console.log('Invalid Form'); return;
    }
    this.userService.register(JSON.stringify(this.regiForm.value))
    .subscribe(
      data=> {console.log(data); this.router.navigate(['/login']);},
      error=>console.error(error)
    )
    console.log(this.regiForm.value);
  }

}
