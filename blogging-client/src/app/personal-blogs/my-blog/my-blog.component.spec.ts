import { RouterModule } from '@angular/router';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBlogComponent } from './my-blog.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';

describe('MyBlogComponent', () => {
  let component: MyBlogComponent;
  let fixture: ComponentFixture<MyBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBlogComponent ],
      imports: [
        ReactiveFormsModule,
        ShareButtonsModule,
        TooltipModule,
        EmojiModule,
        PickerModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue : '/' }
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
