import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from './../services/user.service';
import { AuthorizationService } from './../services/auth.service';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('500ms ease-in')),
      transition('out => in', animate('500ms ease-out'))
    ]),
  ]
})
export class NavbarComponent implements OnInit {

  public currentUserId: string;
  public currentUserName: string;
  public menuState = 'out';
  public recentNotification: any;
  public recentFollowReq: any;
  public numberOfNotification = 0;
  public sizeOfNotifications: number;
  public unreadReq = 0;
  public usersProfile: any;
  private url: any;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuState = 'out';
    }
  }

  constructor(private userService: UserService, private authService: AuthorizationService, private sanitized: DomSanitizer,
    private eRef: ElementRef) {

    this.userService.newTag().subscribe(
      data => {
        if (data.users.includes(this.currentUserName)) {
          this.newNotification();
        }
      },
      error => console.log(error)
    );

    this.userService.newRequestReceived().subscribe(
      data => {
          if (this.currentUserId === data.receiverId) {
              this.newRequest();
          }
      },
      error => console.log(error)
  );

  this.userService.acceptRequestReceived().subscribe(
    data => {
      this.newNotification();
    },
    error => console.log(error)
);
  }

  ngOnInit() {
    this.currentUserId = localStorage.getItem('userId');
    this.currentUserName = localStorage.getItem('user');
    this.newNotification();
    this.DisplayProfile();
    this.newRequest();
  }

  Notify() {
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.changeStatus();
  }

  closeNotify() {
      this.menuState = 'out';
  }

  public getBgColor(balance: number): string {
    return balance > 0 ? 'red' : '';
  }

  public getTextColor(balance: number): string {
    return balance > 0 ? 'white' : '';
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

  changeStatus() {
    this.recentNotification.forEach(element => {
      this.userService.changePostStatus(element._id, this.currentUserName).subscribe(
        (data) => {
          this.numberOfNotification = 0;
        },
        error => console.log(error)
      );
    });
  }

  newNotification() {
    this.userService.NotificationList(this.currentUserName).subscribe(
      (data: any) => {
        for (const index in data) {
          if (data.hasOwnProperty(index)) {
            const taggedUsers = 'taggedUsers';
            const x = data[index][taggedUsers];
            for (const temp in x) {
              if (x.hasOwnProperty(temp)) {
                const userName = 'userName';
                const read = 'read';
                if (x[temp][userName] === this.currentUserName && x[temp][read] === false) {
                  this.numberOfNotification++;
                }
              }
            }
          }
        }
        this.recentNotification = data;
        this.sizeOfNotifications = Object.keys(this.recentNotification).length;
      },
      error => console.log(error)
    );
  }

  newRequest() {
    this.userService.RequestList(this.currentUserId).subscribe(
      (data: any) => {
        data.request.forEach(element => {
          if (element.read === false) {
            this.unreadReq++;
          }
        });
      },
      error => console.log(error)
    );
  }

  changeRequestStatus() {
    this.userService.updatePendingReqStatus(this.currentUserId).subscribe(
      (data) => {
        this.unreadReq = 0;
      },
      error => console.log(error)
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

  Logout = () => this.authService.logout();


}
