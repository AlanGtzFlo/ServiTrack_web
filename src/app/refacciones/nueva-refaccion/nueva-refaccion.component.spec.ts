import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaRefaccionComponent } from './nueva-refaccion.component';

describe('NuevaRefaccionComponent', () => {
  let component: NuevaRefaccionComponent;
  let fixture: ComponentFixture<NuevaRefaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaRefaccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaRefaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
