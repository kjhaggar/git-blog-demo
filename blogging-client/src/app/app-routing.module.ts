import { BlogComponent } from './blog/blog.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
const routes: Routes = [
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'blog/:id', component: BlogComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
