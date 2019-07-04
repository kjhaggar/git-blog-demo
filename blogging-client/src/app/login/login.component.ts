import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    submitted: boolean;
    invalidUser: boolean;

    loginForm: FormGroup = new FormGroup({
        userName: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });
    constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {}
    ngOnInit() {}

    get f() { return this.loginForm.controls; }


    Login() {
        this.submitted = true;
        if (!this.loginForm.valid ) {
            return;
        }

        this.userService.login(JSON.stringify(this.loginForm.value)).subscribe(
            (data: { userId: string, userName: string, success: boolean, message: string}) => {
                if (data.success){
                    alert("not a memmber");
                    console.log(data.message);
                }
                console.log(data)
                this.router.navigate(['/profile']);
                this.userService.currentUserId = data.userId;
                this.userService.currentUserName = data.userName;
                localStorage.setItem('currentUser', JSON.stringify(this.loginForm.value));
            },
            (error) => {
                this.invalidUser = true;
                console.log(error.error.message)
            }
        );
    }
}
