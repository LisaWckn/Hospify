import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEntlassenComponent } from './patient-entlassen.component';

describe('PatientEntlassenComponent', () => {
  let component: PatientEntlassenComponent;
  let fixture: ComponentFixture<PatientEntlassenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientEntlassenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientEntlassenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
