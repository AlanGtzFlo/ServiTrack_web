import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPolicyComponent } from './new-policy.component';

describe('NewPolicyComponent', () => {
  let component: NewPolicyComponent;
  let fixture: ComponentFixture<NewPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
