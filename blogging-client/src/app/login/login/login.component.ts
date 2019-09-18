import { VerifyOTPComponent } from './../verify-otp/verify-otp.component';
import { AppState } from '../../store/blog.state';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../services/auth.service';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as AuthActionTypes from '../../store/actions/auth.action';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  modalRef: MDBModalRef;
  submitted: boolean;
  invalidUser: boolean;
  unauthMessage: string;
  verifyOtp: boolean;

  loginForm: FormGroup = new FormGroup({
    userName: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  });

  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

  constructor(private authorizationService: AuthorizationService, private router: Router,
    private socialAuthService: AuthService, private store: Store<AppState>, actions: Actions,
    private modalService: MDBModalService
  ) {
    actions.pipe(
      ofType('[Auth] - Error'),
    ).subscribe((action: any) => {
      this.invalidUser = true;
      if (action.error.message) {
        this.unauthMessage = action.error.message;
      } else {
        this.unauthMessage = action.error.text;
      }
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
    this.verifyOtp = true;
    this.store.dispatch(AuthActionTypes.Login(this.loginForm.value));
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      debugger
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

  openModal() {
    // this.modalRef = this.modalService.show(VerifyOTPComponent);
  }

  verifyOTP(otp: string) {
    this.authorizationService.verifyOTP(otp).subscribe(
      (data: any) => {
        if (data.status === '0') {
          this.router.navigate(['/home']);
        } else {
          console.log('invalid otp');
          this.authorizationService.logout();
        }
      },
      err => console.log(err)
    );
  }
  FadeOutSuccessMsg() {
    setTimeout(() => {
      this.invalidUser = false;
    }, 3000);
  }
}
