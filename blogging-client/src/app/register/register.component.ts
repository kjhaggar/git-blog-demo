import { AuthorizationService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    AuthService,
    FacebookLoginProvider,
    GoogleLoginProvider
} from 'angular-6-social-login';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    matchPassword: boolean;
    submitted: boolean;

    regiForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        userName: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl(null, Validators.required)
    }
    );


    constructor(private authService: AuthorizationService, private router: Router,
        private socialAuthService: AuthService) { }

    ngOnInit() { }

    get f() { return this.regiForm.controls; }

    Register() {
        this.submitted = true;

        if (this.regiForm.controls.password.value !== this.regiForm.controls.confirmPassword.value) {
            this.matchPassword = true;
            return;
        }
        if (this.regiForm.invalid) {
            return;
        }

        this.authService.register(JSON.stringify(this.regiForm.value)).subscribe(
            data => {
                this.router.navigate(['/login']);
            },
            error => {
                console.error(error);
            }
        );
    }

    public socialSignIn(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform === 'facebook') {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform === 'google') {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        }

        this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
            this.apiConnection(userData);
        });
    }

    apiConnection(data) {
        this.authService.socialRegister(JSON.stringify(data)).subscribe(
            (data: any) => {
                if (data.success === 'false') {
                    console.log(data.message)
                } else {
                    this.router.navigate(['/login']);
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    logout() {
      this.socialAuthService.signOut().then(data => {
      this.authService.logout();
   });
   }

}
