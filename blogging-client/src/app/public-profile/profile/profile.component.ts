import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
public id: string;
public sub: any;
public getCurrentUserId: string;
public getCurrentUserName: string;
public blogProfilePic: any;
public usersProfile: any;
public postList: any;
public sizeOfAllPost: number;

constructor(private route: ActivatedRoute, private userService: UserService,
  private sanitized: DomSanitizer) {

    this.userService.newPostReceived().subscribe(
      data => {
        this.getProfileData();
      }
  );
  }

ngOnInit() {
  this.route.params.subscribe(params => {
    const postId = 'id';
    this.id = params[postId];
    this.getProfileData();
  });
  this.getCurrentUserId = localStorage.getItem('userId');
  this.getCurrentUserName = localStorage.getItem('user');

  this.DisplayProfile();
}

getProfileData() {
  this.userService.getProfileData(this.id).subscribe(
    (data: any) => {
      this.userService.getpublicBlog(data.userName || data.firstName, this.id).subscribe(
        data => {
          this.postList = Object.values(data).sort((val1, val2) => {
            const start = +new Date(val1.createdAt);
            const end = +new Date(val2.createdAt);
            return end - start;
          });
          this.sizeOfAllPost = Object.keys(this.postList).length;
        },
        err => console.log(err)
      );
    },
    error => {
      console.log(error.message);
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
      this.blogProfilePic = 'http://localhost:3000/images/download.jpeg';
      // this.blogProfilePic = 'https://backend-blogging-appliaction.herokuapp.com/images/download.jpeg';
  } else {
      this.blogProfilePic = 'http://localhost:3000/images/' + filename;
      // this.blogProfilePic = 'https://backend-blogging-appliaction.herokuapp.com/images/' + filename;
  }
  return this.sanitized.bypassSecurityTrustUrl(this.blogProfilePic);
}
}
