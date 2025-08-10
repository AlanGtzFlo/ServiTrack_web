import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionDetailComponent } from './ubicacion-detail.component';

describe('UbicacionDetailComponent', () => {
  let component: UbicacionDetailComponent;
  let fixture: ComponentFixture<UbicacionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicacionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicacionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
