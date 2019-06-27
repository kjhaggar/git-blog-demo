import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login_form:FormGroup = new FormGroup({
    user_name:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required)
  })

  constructor() { }

  ngOnInit() {
  }

}
