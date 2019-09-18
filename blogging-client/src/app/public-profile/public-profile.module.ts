
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavbarModule } from './../navbar/navbar.module';
import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { PublicProfileRoutingModule } from './public-profile-routing.module';

import { ProfileComponent } from './profile/profile.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ParentComponent } from './parent/parent.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileCardComponent,
    EditProfileComponent,
    ParentComponent
  ],
  imports: [
    CommonModule,
    PublicProfileRoutingModule,
    NavbarModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ]
})
export class PublicProfileModule { }
