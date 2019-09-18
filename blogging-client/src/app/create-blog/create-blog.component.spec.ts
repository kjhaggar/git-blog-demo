import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MentionModule } from 'angular-mentions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NavbarComponent } from './../navbar/navbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBLogComponent } from './create-blog.component';
import { Routes } from '@angular/router';

describe('CreateBLogComponent', () => {
  let component: CreateBLogComponent;
  let fixture: ComponentFixture<CreateBLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateBLogComponent,
        NavbarComponent
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MentionModule,
        RouterTestingModule,
        HttpClientTestingModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyBzS-pIcW-xUtwOFGXt2ErDPfpAbLCRgSc',
          libraries: ['places']
        })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
