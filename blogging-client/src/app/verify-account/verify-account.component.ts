import { UserService } from './../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {
  private token: string;
  public invalidMessage: string;
  public validToken = true;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const token = 'token';
      this.token = params[token];
    });
    this.userService.verifyAccount(this.token).subscribe(
      (data) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.validToken = false;
        this.invalidMessage = error.error.text;
      }
    );
  }
}
