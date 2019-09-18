import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './../../public-profile/profile/profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FilterPipe } from './../filter.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './../../navbar/navbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsListComponent } from './friends-list.component';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('FriendsListComponent', () => {
  let component: FriendsListComponent;
  let fixture: ComponentFixture<FriendsListComponent>;

  const routes: Routes = [
    { path: '', component: FriendsListComponent},
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FriendsListComponent,
        NavbarComponent,
        FilterPipe
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
