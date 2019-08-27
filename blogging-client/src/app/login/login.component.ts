import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    submitted: boolean;
    invalidUser: boolean;
    unauthMessage: string;

    loginForm: FormGroup = new FormGroup({
        userName: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });

    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.router.navigate(['/home']);
        }
    }

    get f() { return this.loginForm.controls; }


    Login() {
        this.submitted = true;
        if (!this.loginForm.valid ) {
            return;
        }
        this.authService.login(JSON.stringify(this.loginForm.value)).subscribe(
            (data: any) => {
                this.router.navigate(['/home']);
                this.authService.storeUserData(data.token, data.userName, data.userId);
            },
            error => {
                this.invalidUser = true;
                this.unauthMessage = error.error.message;
            }
        );
    }

}
