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
  url: any;
  submitted: boolean;
  hideSuccessMessage = false;
  hideNoUpdateMessage = false;
  changePassword = false;
  disableBtn = false;
  originalData: any;

  constructor(private http: HttpClient, private router :Router, private userService: UserService) {}

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
      this.userService.getProfileData(this.getCurrentUserId).subscribe(
          data => {
              this.originalData = data.user;
              this.updateForm.get('userName').setValue(data.user.userName);
              this.updateForm.get('firstName').setValue(data.user.firstName);
              this.updateForm.get('lastName').setValue(data.user.lastName);
            },
            error => {console.log(error)}
        )
    }

  get f() { return this.updateForm.controls; }

  enableSubmitButton(){
      this.disableBtn =true;
  }

  fileChangeEvent(event: any) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result;
    }

    EnablePasswordChange(){
        this.changePassword = !this.changePassword;
    }

  Update = () => {debugger
      this.submitted = true;
      if(!this.updateForm.valid){
          return;
      }

      if(this.originalData == this.updateForm.value) {
          this.hideNoUpdateMessage = true;
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

}
