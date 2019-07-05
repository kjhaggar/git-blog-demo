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

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}
    
    ngOnInit() {
    }

    get f() { return this.loginForm.controls; }


    Login() {
        this.submitted = true;
        if (!this.loginForm.valid ) {
            return;
        }
        this.authService.login(JSON.stringify(this.loginForm.value)).subscribe(
            (data: { userId: string, userName: string, success: boolean, message: string,token: string}) => {
                if (data.success){
                    alert("not a memmber");
                    console.log(data.message);
                }
                this.router.navigate(['/profile']);
                this.authService.currentUserId = data.userId;
                this.authService.currentUserName = data.userName;
                this.authService.storeUserData(data.token, data.userName);
            },
            error => {debugger
                this.invalidUser = true;
                this.unauthMessage = error.error.message;
            }
        );
    }
}
