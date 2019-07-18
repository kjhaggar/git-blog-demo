import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from './../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  selectedFile: File;
  getCurrentUserId: string;
  getCurrentProfilePicture: any;
  url: any;
  submitted: boolean;
  hideSuccessMessage = false;
  hideNoUpdateMessage = false;
  changePassword = false;
  disableBtn: boolean;
  originalData: any;
  pwdsubmitted = true;
  matchPassword: boolean;
  validPicture = "Delete current picutre";

  constructor(
      private http: HttpClient,
      private router :Router,
      private userService: UserService,
      private sanitized: DomSanitizer) {}

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
        (data: {user: any}) => {
            this.originalData = data.user;
            this.updateForm.get('userName').setValue(data.user.userName);
            this.updateForm.get('firstName').setValue(data.user.firstName);
            this.updateForm.get('lastName').setValue(data.user.lastName);
            this.getCurrentProfilePicture = data.user.image;
            if(this.getCurrentProfilePicture == null) {
                this.disableBtn = true;
                this.validPicture = "No image uploaded";
                this.url = 'http://localhost:3000/images/download.jpeg';
            } else {
              this.disableBtn = false;
              this.validPicture = "Delete current picutre";
              this.url = 'http://localhost:3000/images/' + this.getCurrentProfilePicture;
            }
      },
      error => {
            console.log(error.message)
      }
  );
}

  get f() { return this.updateForm.controls; }

  fileChangeEvent(event: any) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.url = reader.result;
      }
    }

    EnablePasswordChange(){
        this.changePassword = !this.changePassword;
        this.submitted = false;
        this.pwdsubmitted = false;
    }

  Update = () => {debugger
      this.submitted = true;
      if(this.updateForm.touched) {
      this.pwdsubmitted = true;
      }
      if(!this.updateForm.invalid){
          return;
      }

      if(this.originalData == this.updateForm.value) {
          this.hideNoUpdateMessage = true;
      }

      if (this.updateForm.controls.password.value !== this.updateForm.controls.confirmPassword.value) {
        this.matchPassword = true;
        return;
    }
      const formData = new FormData();
      if(this.selectedFile) {
          formData.append("image", this.selectedFile, this.selectedFile.name);
        }
        
      formData.append("forminput", JSON.stringify(this.updateForm.value));
      this.http.put('http://127.0.0.1:3000/api/uploadData/' + this.getCurrentUserId, formData)
      .subscribe(
          data => {
            this.hideSuccessMessage = true;
            this.getProfileData();
          },
          error => {
              console.log(error);
            }
        );
    }

    FadeOutSuccessMsg() {
        setTimeout( () => {
            this.hideSuccessMessage = false;
            this.hideNoUpdateMessage = false;
        }, 4000);
    }

    deleteProfilePicture() {
        this.userService.deleteProfilePicture(this.getCurrentUserId).subscribe(
            data=> {
                this.getProfileData();
              },
              error=>console.error(error)
          )
    }

}
