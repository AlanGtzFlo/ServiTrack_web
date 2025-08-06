import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefaccionesListComponent } from './refacciones-list.component';

describe('RefaccionesListComponent', () => {
  let component: RefaccionesListComponent;
  let fixture: ComponentFixture<RefaccionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefaccionesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefaccionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
