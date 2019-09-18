import { MDBBootstrapModule, MDBModalService, ModalModule } from 'angular-bootstrap-md';
import { AuthEffects } from './../../store/effects/auth.effect';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, AuthServiceConfig } from 'angular-6-social-login';
import { getAuthServiceConfigs } from 'src/app/app.module';
import { ToDoReducer } from 'src/app/store/reducers/auth.reducers';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot({ login: ToDoReducer }),
        EffectsModule.forRoot([AuthEffects]),
        MDBBootstrapModule,
        ModalModule.forRoot()
      ],
      providers: [
        AuthService,
        {
          provide: AuthServiceConfig,
          useFactory: getAuthServiceConfigs
        },
        MDBModalService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set submitted to true', () => {
    component.Login();
    expect(component.submitted).toBeTruthy();
  });

  // it('should call the Login method', () => {
  //   fixture.detectChanges();
  //   spyOn(component, 'Login');
  //   el = fixture.debugElement.query(By.css('button.login')).nativeElement;
  //   el.click();
  //   expect(component.Login).toHaveBeenCalledTimes(0);
  // });
});
