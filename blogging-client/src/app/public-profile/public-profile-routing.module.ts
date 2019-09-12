import { ParentComponent } from './parent/parent.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthGuard } from './../guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: ParentComponent,
    children: [
      {
        path: 'editProfile', component: EditProfileComponent, canActivate: [AuthGuard]
      },
      {
        path: ':id', component: ProfileComponent
      },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicProfileRoutingModule { }
