import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBehandlungComponent } from './add-behandlung.component';

describe('AddBehandlungComponent', () => {
  let component: AddBehandlungComponent;
  let fixture: ComponentFixture<AddBehandlungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBehandlungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBehandlungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
