import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FriendsComponent } from './friends/friends.component';
import { PersonalBlogsComponent } from './personal-blogs/personal-blogs.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { MyblogComponent } from './myblog/myblog.component';
import { BlogComponent } from './blog/blog.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CreateBLogComponent } from './create-blog/create-blog.component';

import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'createBlog', component: CreateBLogComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: BlogComponent, canActivate: [AuthGuard] },
  { path: 'personalBlogs', component: PersonalBlogsComponent, canActivate: [AuthGuard] },
  { path: 'myBlog/:id', component: MyblogComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'publicProfile/:id', component: PublicProfileComponent},
  { path: 'resetPassword', component: ResetPasswordComponent},
  { path: 'reset/:token', component: SetNewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
