import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './../../navbar/navbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBlogsListComponent } from './personal-blogs-list.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonalBlogsListComponent', () => {
  let component: PersonalBlogsListComponent;
  let fixture: ComponentFixture<PersonalBlogsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PersonalBlogsListComponent,
        NavbarComponent
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalBlogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
