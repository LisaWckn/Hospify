import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehandlungsplanTabelleComponent } from './behandlungsplan-tabelle.component';

describe('BehandlungsplanTabelleComponent', () => {
  let component: BehandlungsplanTabelleComponent;
  let fixture: ComponentFixture<BehandlungsplanTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BehandlungsplanTabelleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BehandlungsplanTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
