import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSidebarComponent } from './new-sidebar.component';

describe('NewSidebarComponent', () => {
  let component: NewSidebarComponent;
  let fixture: ComponentFixture<NewSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
