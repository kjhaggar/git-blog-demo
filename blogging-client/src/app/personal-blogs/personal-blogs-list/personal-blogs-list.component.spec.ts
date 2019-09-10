import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBlogsListComponent } from './personal-blogs-list.component';

describe('PersonalBlogsListComponent', () => {
  let component: PersonalBlogsListComponent;
  let fixture: ComponentFixture<PersonalBlogsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalBlogsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalBlogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
