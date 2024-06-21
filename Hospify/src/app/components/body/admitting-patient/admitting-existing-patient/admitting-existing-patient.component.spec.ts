import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmittingExistingPatientComponent } from './admitting-existing-patient.component';

describe('AdmittingExistingPatientComponent', () => {
  let component: AdmittingExistingPatientComponent;
  let fixture: ComponentFixture<AdmittingExistingPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmittingExistingPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmittingExistingPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
