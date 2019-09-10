import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
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
