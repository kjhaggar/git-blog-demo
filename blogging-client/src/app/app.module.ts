import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AgmCoreModule } from '@agm/core';
import { MentionModule } from 'angular-mentions';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TooltipModule } from 'ng2-tooltip-directive';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { MyblogComponent } from './myblog/myblog.component';
import { FilterPipe } from './filter.pipe';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

import { AuthInterceptor } from './interceptor/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { PublicProfileComponent } from './public-profile/public-profile.component';


export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];

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
    PublicProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OrderModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MentionModule,
    FilterPipeModule,
    EmojiModule,
    PickerModule,
    ShareButtonsModule,
    TooltipModule,
    MDBBootstrapModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBzS-pIcW-xUtwOFGXt2ErDPfpAbLCRgSc',
      libraries: ['places']
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthInterceptor, UserService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
