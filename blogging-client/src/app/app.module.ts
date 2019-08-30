import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { MentionModule } from 'angular-mentions';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular-6-social-login';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { MyblogComponent } from './myblog/myblog.component';
import { FilterPipe } from './filter.pipe';

import { AuthorizationService } from './services/auth.service';
import { UserService } from './services/user.service';

import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { CreateBLogComponent } from './create-blog/create-blog.component';
import { PersonalBlogsComponent } from './personal-blogs/personal-blogs.component';
import { FriendsComponent } from './friends/friends.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
  [
  {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider('493698497854128')
  }
  ]
  );
  return config;
  }

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        EditProfileComponent,
        BlogComponent,
        MyblogComponent,
        FilterPipe,
        PublicProfileComponent,
        CreateBLogComponent,
        PersonalBlogsComponent,
        FriendsComponent,
        NavbarComponent,
        ProfileCardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        OrderModule,
        BrowserAnimationsModule,
        MentionModule,
        FilterPipeModule,
        EmojiModule,
        PickerModule,
        ShareButtonsModule,
        TooltipModule,
        MDBBootstrapModule,
        SocialLoginModule,
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
