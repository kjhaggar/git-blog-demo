import { NavbarModule } from './../navbar/navbar.module';
import { FilterPipe } from './filter.pipe';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FriendsRoutingModule } from './friends-routing.module';

import { FriendsListComponent } from './friends-list/friends-list.component';


@NgModule({
  declarations: [
    FriendsListComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FriendsRoutingModule,
    NavbarModule,
    FilterPipeModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ]
})
export class FriendsModule { }
