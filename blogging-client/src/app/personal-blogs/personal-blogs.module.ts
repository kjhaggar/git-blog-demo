import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { PersonalBlogsRoutingModule } from './personal-blogs-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { TooltipModule } from 'ng2-tooltip-directive';

import { PersonalBlogsListComponent } from './personal-blogs-list/personal-blogs-list.component';
import { MyBlogComponent } from './my-blog/my-blog.component';

@NgModule({
  declarations: [
    PersonalBlogsListComponent,
    MyBlogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarModule,
    PersonalBlogsRoutingModule,
    PickerModule,
    EmojiModule,
    ShareButtonsModule,
    TooltipModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ]
})
export class PersonalBlogsModule { }
