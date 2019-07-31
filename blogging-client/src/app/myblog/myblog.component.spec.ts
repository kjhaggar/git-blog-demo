import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyblogComponent } from './myblog.component';

describe('MyblogComponent', () => {
  let component: MyblogComponent;
  let fixture: ComponentFixture<MyblogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyblogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyblogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
