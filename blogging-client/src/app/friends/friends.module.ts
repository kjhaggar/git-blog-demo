import { NavbarModule } from './../navbar/navbar.module';
import { FilterPipe } from './filter.pipe';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    FriendsRoutingModule,
    NavbarModule,
    FilterPipeModule
  ]
})
export class FriendsModule { }
