import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from './../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public pwdsubmitted = true;
  public matchPassword: boolean;
  public validPicture = 'Delete current picutre';
  public disableBtn: boolean;
  public url: any;
  public submitted: boolean;
  public hideSuccessMessage = false;
  public hideNoUpdateMessage = false;
  public changePassword = false;
  private selectedFile: File;
  public getCurrentUserId: string;
  private originalData: any;

  constructor(private http: HttpClient, private userService: UserService) { }

  updateForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required)
  });

  ngOnInit() {
    this.getCurrentUserId = localStorage.getItem('userId');
    this.getProfileData();
  }

  getProfileData() {
    this.userService.getProfileData(this.getCurrentUserId).subscribe(
      (data: any) => {
        this.originalData = data;
        this.updateForm.get('userName').setValue(data.userName);
        this.updateForm.get('firstName').setValue(data.firstName);
        this.updateForm.get('lastName').setValue(data.lastName);

        if (data.provider_pic) {
          this.disableBtn = false;
          this.validPicture = 'Delete current picutre';
          this.url = data.provider_pic;
        } else if (data.image) {
          this.disableBtn = false;
          this.validPicture = 'Delete current picutre';
          this.url = 'http://localhost:3000/images/' + data.image;
          // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + data.image;
        } else {
          this.disableBtn = true;
          this.validPicture = 'No image uploaded';
          this.url = 'http://localhost:3000/images/download.jpeg';
          // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
        }
      },
      error => {
        console.log(error.message);
      }
    );
  }

  get f() { return this.updateForm.controls; }

  fileChangeEvent(event: any) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.url = reader.result;
    };
  }

  EnablePasswordChange() {
    this.changePassword = !this.changePassword;
    this.submitted = false;
    this.pwdsubmitted = false;
    this.updateForm.get('password').setValue('');
    this.updateForm.get('confirmPassword').setValue('');
  }

  Update = () => {
    this.submitted = true;
    if (this.updateForm.touched) {
      this.pwdsubmitted = true;
    }
    if (!this.updateForm.invalid) {
      return;
    }

    if (this.originalData === this.updateForm.value) {
      this.hideNoUpdateMessage = true;
    }

    if (this.updateForm.controls.password.value !== this.updateForm.controls.confirmPassword.value) {
      this.matchPassword = true;
      return;
    }
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    formData.append('forminput', JSON.stringify(this.updateForm.value));
    this.http.put('http://localhost:3000/api/uploadData/' + this.getCurrentUserId, formData)
      .subscribe(
        data => {
          this.changePassword = false;
          this.hideSuccessMessage = true;
          this.getProfileData();
        },
        error => {
          console.log(error);
        }
      );
  }

  FadeOutSuccessMsg() {

    if (this.matchPassword) {
      setTimeout(() => {
        this.matchPassword = false;
      }, 4000);
    }
    setTimeout(() => {
      this.hideSuccessMessage = false;
      this.hideNoUpdateMessage = false;
    }, 4000);
  }

  deleteProfilePicture() {
    this.userService.deleteProfilePicture(this.getCurrentUserId).subscribe(
      data => {
        this.getProfileData();
      },
      error => console.error(error)
    );
  }

}
