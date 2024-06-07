import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLinesComponent } from './header-lines.component';

describe('HeaderLinesComponent', () => {
  let component: HeaderLinesComponent;
  let fixture: ComponentFixture<HeaderLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderLinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
