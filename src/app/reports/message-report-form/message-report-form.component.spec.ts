import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReportFormComponent } from './message-report-form.component';

describe('MessageReportFormComponent', () => {
  let component: MessageReportFormComponent;
  let fixture: ComponentFixture<MessageReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
