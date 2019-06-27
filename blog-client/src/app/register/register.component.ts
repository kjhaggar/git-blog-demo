import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  regiForm:FormGroup = new FormGroup({
    Email:new FormControl(null,[Validators.email,Validators.required]),
    UserName:new FormControl(null,Validators.required),
    FirstName:new FormControl(null,Validators.required),
    LastName:new FormControl(null,Validators.required),
    Password:new FormControl(null,Validators.required),
    ConfirmPassword:new FormControl(null,Validators.required)
  })
  constructor() { }

  ngOnInit() {
  }

}
