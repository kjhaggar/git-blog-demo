import { AuthService, AuthServiceConfig } from 'angular-6-social-login';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { getAuthServiceConfigs } from '../app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        {
          provide: AuthServiceConfig,
          useFactory: getAuthServiceConfigs
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set submitted to true', () => {
    component.Register();
    expect(component.submitted).toBeTruthy();
  });

  it('should call the Register method', () => {
    fixture.detectChanges();
    spyOn(component, 'Register');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.Register).toHaveBeenCalledTimes(0);
  });

  it('form should be invalid', async(() => {
    component.regiForm.controls['firstName'].setValue('');
    component.regiForm.controls['lastName'].setValue('');
    component.regiForm.controls['userName'].setValue('');
    component.regiForm.controls['email'].setValue('');
    component.regiForm.controls['phone'].setValue('');
    expect(component.regiForm.valid).toBeFalsy();
  }));

  it('form should be valid', async(() => {
    component.regiForm.controls['firstName'].setValue('gfd');
    component.regiForm.controls['lastName'].setValue('sghagd');
    component.regiForm.controls['userName'].setValue('dsf');
    component.regiForm.controls['email'].setValue('sqas@ji.fe');
    component.regiForm.controls['phone'].setValue('3216549874');
    component.regiForm.controls['password'].setValue('qwerty');
    component.regiForm.controls['confirmPassword'].setValue('qwerty');
    expect(component.regiForm.valid).toBeTruthy();
  }));
});
