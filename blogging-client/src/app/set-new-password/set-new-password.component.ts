import { UserService } from './../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {
  token: string;
  public validateToken: boolean;
  public invalidMessage: string;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const token = 'token';
      this.token = params[token];
    });
    this.userService.setNewPassword(this.token).subscribe(
      (data) => {
        this.validateToken = true;
      },
      (error) => {
        this.invalidMessage = error.error.text;
      }
    );
  }

  UpdatePassword(password: string, confirmPassword) {
    if (password !== confirmPassword) {
      return;
    }
    this.userService.updatedPassword(this.token, password).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        alert(err.error.text);
        this.router.navigate(['/home']);
      }
    );
  }
}
