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
    message: string;

    loginForm: FormGroup = new FormGroup({
        userName: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}
    
    ngOnInit() {
        if(localStorage.getItem('token')){
            this.router.navigate(['/profile']);
        }
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
                this.authService.storeUserData(data.token, data.userName, data.userId);
            },
            error => {
                this.invalidUser = true;
                console.log(error.error.message);
            }
        );
    }
}
