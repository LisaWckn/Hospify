import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehandlungenTabelleComponent } from './behandlungen-tabelle.component';

describe('BehandlungenTabelleComponent', () => {
  let component: BehandlungenTabelleComponent;
  let fixture: ComponentFixture<BehandlungenTabelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BehandlungenTabelleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BehandlungenTabelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
