import { NavbarModule } from './navbar/navbar.module';
import { AuthEffects } from './store/effects/auth.effect';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { MentionModule } from 'angular-mentions';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular-6-social-login';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { CreateBLogComponent } from './create-blog/create-blog.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';

import { AuthorizationService } from './services/auth.service';
import { UserService } from './services/user.service';

import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';

import { ToDoReducer } from './store/reducers/auth.reducers';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
  [
  {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('493698497854128')
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('186215547479-3jf5m9tc409407fso1ojchpubcm6f4fg.apps.googleusercontent.com')
}
  ]
  );
  return config;
  }

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        CreateBLogComponent,
        SetNewPasswordComponent,
        VerifyAccountComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NavbarModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        OrderModule,
        BrowserAnimationsModule,
        MentionModule,
        EmojiModule,
        PickerModule,
        ShareButtonsModule,
        TooltipModule,
        MDBBootstrapModule,
        SocialLoginModule,
        StoreModule.forRoot({ login: ToDoReducer }),
        EffectsModule.forRoot([AuthEffects]),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBzS-pIcW-xUtwOFGXt2ErDPfpAbLCRgSc',
            libraries: ['places']
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
          provide: AuthServiceConfig,
          useFactory: getAuthServiceConfigs
          },
        AuthInterceptor, UserService, AuthorizationService, AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
