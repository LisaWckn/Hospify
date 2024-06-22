import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmittingNewPatientComponent } from './admitting-new-patient.component';

describe('AdmittingNewPatientComponent', () => {
  let component: AdmittingNewPatientComponent;
  let fixture: ComponentFixture<AdmittingNewPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdmittingNewPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmittingNewPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
