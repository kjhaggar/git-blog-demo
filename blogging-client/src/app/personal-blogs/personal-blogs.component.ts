import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-blogs',
  templateUrl: './personal-blogs.component.html',
  styleUrls: ['./personal-blogs.component.css']
})
export class PersonalBlogsComponent implements OnInit {
  public sizeOfMyPost: number;
  public currentUserId: string;
  public currentUserName: string;
  public displayMyPost: any;
  public usersProfile: any;
  private url: any;

  updatePost: FormGroup = new FormGroup({
    description: new FormControl(null, Validators.required),
    image: new FormControl(null)
  });
  constructor(private userService: UserService, private sanitized: DomSanitizer) { }

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId');
    this.currentUserName = localStorage.getItem('user');
    this.DisplayMyPost();
    this.DisplayProfile();
  }

  DisplayMyPost() {
    this.userService.getPostById(this.currentUserId).subscribe(
      data => {
        this.displayMyPost = Object.values(data).sort((val1, val2) => {
          const start = +new Date(val1.createdAt);
          const end = +new Date(val2.createdAt);
          return end - start;
        });
        this.sizeOfMyPost = Object.keys(this.displayMyPost).length;
      }
    );
  }

  DisplayProfile() {
    this.userService.displayProfile().subscribe(
      data => {
        this.usersProfile = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  GetImageUrl(filename) {
    if (filename === undefined) {
      this.url = 'http://localhost:3000/images/download.jpeg';
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
    } else {
      this.url = 'http://localhost:3000/images/' + filename;
      // this.url = 'https://backend-blogging-appliaction.herokuapp.com/images/' + filename;
    }
    return this.sanitized.bypassSecurityTrustUrl(this.url);
  }
}
