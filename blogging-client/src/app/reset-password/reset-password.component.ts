import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public mailSent: boolean;
  public message: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  sendMail(email: string) {
    this.userService.ResetPwdMail(email).subscribe(
      (data) => console.log(data),
      (error) => {
        this.message = error.error.text;
      }
    );
    this.mailSent = true;
  }
}
