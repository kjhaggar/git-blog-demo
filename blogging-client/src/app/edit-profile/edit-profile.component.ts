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

  constructor(private http: HttpClient, private router :Router) { }

  updateForm: FormGroup = new FormGroup({
    userName: new FormControl(null, Validators.required),
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, Validators.required),
    image: new FormControl(null, Validators.required)
}
);

  ngOnInit() {
    this.getCurrentUserId = localStorage.getItem('userId');
  }

  fileChangeEvent(event: any) {debugger
    this.selectedFile = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
      this.url = reader.result; 
  }

  Update = () => {debugger
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      this.http.put('http://127.0.0.1:3000/api/uploadData/' + this.getCurrentUserId , formData, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe(
          event => {},
          error => {
              console.log(error);
          });
    }

}
