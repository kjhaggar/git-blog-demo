import { MyBlogComponent } from './my-blog/my-blog.component';
import { AuthGuard } from './../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalBlogsListComponent } from './personal-blogs-list/personal-blogs-list.component';


const routes: Routes = [
  { path: '', component: PersonalBlogsListComponent },
  { path: 'myBlog/:id', component: MyBlogComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalBlogsRoutingModule { }
