import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationenTabelleComponent } from './operationen-tabelle.component';

describe('OperationenTabelleComponent', () => {
  let component: OperationenTabelleComponent;
  let fixture: ComponentFixture<OperationenTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationenTabelleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperationenTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
