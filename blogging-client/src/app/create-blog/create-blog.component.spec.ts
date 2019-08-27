import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBLogComponent } from './create-blog.component';

describe('CreateBLogComponent', () => {
  let component: CreateBLogComponent;
  let fixture: ComponentFixture<CreateBLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
