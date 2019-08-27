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

import { AuthGuard } from './guards/auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CreateBLogComponent } from './create-blog/create-blog.component';
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
  { path: 'publicProfile/:id', component: PublicProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
