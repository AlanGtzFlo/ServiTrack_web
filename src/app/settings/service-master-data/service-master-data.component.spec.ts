import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMasterDataComponent } from './service-master-data.component';

describe('ServiceMasterDataComponent', () => {
  let component: ServiceMasterDataComponent;
  let fixture: ComponentFixture<ServiceMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceMasterDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
