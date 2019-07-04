import { UserService } from './../user.service';
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

    regiForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        userName: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl(null, Validators.required)
    });

    constructor(private userService: UserService, private router: Router) {}

    ngOnInit() {}

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

        this.userService.register(JSON.stringify(this.regiForm.value)).subscribe(
            data => {
                this.router.navigate(['/login']);
            },
            error => {
        console.error(error);
    });
  }
}
