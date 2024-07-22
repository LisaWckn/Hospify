import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticFindingComponent } from './diagnostic-finding.component';

describe('DiagnosticFindingComponent', () => {
  let component: DiagnosticFindingComponent;
  let fixture: ComponentFixture<DiagnosticFindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiagnosticFindingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagnosticFindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
