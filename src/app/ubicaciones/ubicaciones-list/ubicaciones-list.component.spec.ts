import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionesListComponent } from './ubicaciones-list.component';

describe('UbicacionesListComponent', () => {
  let component: UbicacionesListComponent;
  let fixture: ComponentFixture<UbicacionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicacionesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicacionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
