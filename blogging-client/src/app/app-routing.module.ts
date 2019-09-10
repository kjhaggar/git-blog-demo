import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { RegisterComponent } from './register/register.component';
import { CreateBLogComponent } from './create-blog/create-blog.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'createBlog', component: CreateBLogComponent, canActivate: [AuthGuard] },
  { path: 'reset/:token', component: SetNewPasswordComponent },
  { path: 'verifyAccount/:token', component: VerifyAccountComponent },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'personalBlogs',
    loadChildren: () => import('./personal-blogs/personal-blogs.module').then(mod => mod.PersonalBlogsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then(mod => mod.FriendsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'publicProfile',
    loadChildren: () => import('./public-profile/public-profile.module').then(mod => mod.PublicProfileModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
