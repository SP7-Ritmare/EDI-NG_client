import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMetadataDialogComponent } from './send-metadata-dialog.component';

describe('SendMetadataDialogComponent', () => {
  let component: SendMetadataDialogComponent;
  let fixture: ComponentFixture<SendMetadataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendMetadataDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
