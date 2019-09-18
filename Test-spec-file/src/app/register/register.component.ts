import { AuthoAuthorizationServiceService } from './../autho-authorization-service.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  matchPassword: boolean;
  submitted: boolean;
  public invalidMessage: string;
  public registrationError: boolean;

  regiForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    userName: new FormControl(null, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, Validators.required)
  }
  );

  constructor(private authService: AuthoAuthorizationServiceService, private router: Router) { }

  ngOnInit() { }

  get f() { return this.regiForm.controls; }

  Register(countryCode?: string) {
    this.submitted = true;

    if (this.regiForm.controls.password.value !== this.regiForm.controls.confirmPassword.value) {
      this.matchPassword = true;
      return;
    }
    if (this.regiForm.invalid) {
      return;
    }

    const body = {
      formValue: this.regiForm.value,
      countryCode
    };

    this.authService.register(body).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/login']);
      },
      error => {
        alert(error.error.text);
        this.router.navigate(['/login']);
      }
    );
  }

}
