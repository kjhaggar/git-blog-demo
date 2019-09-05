import { AppState } from './../store/blog.state';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../services/auth.service';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as AuthActionTypes from '../store/actions/auth.action';

declare var FB: any;

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

  constructor(private authorizationService: AuthorizationService, private router: Router,
    private ngZone: NgZone, private socialAuthService: AuthService, private store: Store<AppState>, actions: Actions
  ) {
    actions.pipe(
      ofType('[Auth] - Error'),
    ).subscribe((action: any) => {
      this.invalidUser = true;
      this.unauthMessage = action.error.message;
    });
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
  }
  }

  get f() { return this.loginForm.controls; }


  Login() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    const payload = this.loginForm.value;
    this.store.dispatch(AuthActionTypes.Login(this.loginForm.value));
    // this.authorizationService.login(JSON.stringify(this.loginForm.value)).subscribe(
    //   (data: any) => {
    //     this.authorizationService.storeUserData(data);
    //   },
    //   error => {
    //     this.invalidUser = true;
    //     this.unauthMessage = error.error.message;
    //   }
    // );
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
    this.authorizationService.socialLogin(data).subscribe(
      (result: any) => {
        if (result) {
          this.authorizationService.storeUserData(data, result[0]);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
